import * as React from 'react';
import './TestRunForm.scss';
import * as _ from 'lodash';
import { Formik } from 'formik';
import { TestRunConfig } from '../../../shared/models/TestRunConfig';
import { WSConnectionInfo } from '../../../shared/models/WSConnectionInfo';
import FormikCheckbox from '../form/FormikCheckbox';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

interface TestRunFormProps {
    connectToWs: (config:WSConnectionInfo) => void;
    runTest: (runTestConfig:TestRunConfig) => void;
    defaultHost: string;
    defaultWsPort: number;
}

export class TestRunForm extends React.Component<TestRunFormProps, any> {

    getTestDirInput(values:any, errors:any, touched:any, handleChange:any, handleBlur:any): any|void {
        if (!values.remoteConnect) {
            return  (
                <div className="form-group">
                    <label>Test Directory</label>
                    <input
                        type="text"
                        name="testDirPath"
                        className="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.testDirPath}
                    />
                    {touched.testDirPath && errors.testDirPath && <div>{errors.testDirPath}</div>}
                </div>
            )
        }
    }

    getRemoteConnectCheckbox() {
        const onCheckboxChange = (currentValue:string, e:React.ChangeEvent) => {
            return !currentValue;
        }

        return (
            <div className="form-group">
                <FormikCheckbox name='remoteConnect' label="Connect to an already running instance?" value={true} onChange={onCheckboxChange.bind(this)} />
            </div>
        )
    }

    getHostInput(values:any, errors: any, touched:any, handleChange:any, handleBlur:any) {
        if (!values.remoteConnect) { return; }

        return (
            <div className="form-group">
                <Tooltip overlay='The host that your Busybee Instance is running on'>
                    <label>
                        WebSocket Host <span className="icon icon-help-circled"></span>
                    </label>
                </Tooltip>
                <input
                    type="text"
                    name="wsHost"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.wsHost}
                />
                {touched.wsHost && errors.wsHost && <div>{errors.wsHost}</div>}
            </div>
        )
    }

    render(){

        const getWebsocketPortTip = (isRemoteConnect:boolean) => {
            return isRemoteConnect ?
                'The Websocket port that a running Busybee Instance is currently bound to'
                : 'The Websocket port that Busybee will bind to for communicating with the Busybee UI'
        }
        
        return (
            <div className="col-sm-6 col-offset-3">
                <Formik
                        initialValues={{
                          remoteConnect: false,
                          testDirPath: '/Users/212589146/dev/busybee/busybee/test/IT/fixtures/REST-multi-env',
                          wsHost: `${this.props.defaultHost}`,
                          wsPort: `${this.props.defaultWsPort}`   
                        }}
                        validate={values => {
                            let errors:any = {};
                            const required = 'This is a required field';
                            if (values.remoteConnect) {
                                if (_.isEmpty(values.wsHost)) {
                                    errors.wsHost = required;
                                }
                                if (_.isEmpty(values.wsPort)) {
                                    errors.wsPort = required;
                                }
                            } else {
                                if (_.isEmpty(values.testDirPath)) {
                                    errors.testDirPath = required;
                                }
                                if (_.isEmpty(values.wsPort)) {
                                    errors.wsPort = required;
                                }
                            }
                            return errors;
                        }}
                        onSubmit={(
                            values,
                            { setSubmitting, setErrors }
                        ) => {
                            if (values.remoteConnect) {
                               const wsConnection = new WSConnectionInfo(values.wsHost, parseInt(values.wsPort));
                               this.props.connectToWs(wsConnection);
                            } else {
                                const wsConnection = new WSConnectionInfo('127.0.0.1', parseInt(values.wsPort));
                                const runConfig = new TestRunConfig(values.testDirPath, wsConnection);
                                this.props.runTest(runConfig);
                            }
                            
                        }}
                        render={({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                {this.getRemoteConnectCheckbox()}
                                {this.getTestDirInput(values, errors, touched, handleChange, handleBlur)}
                                {this.getHostInput(values, errors, touched, handleChange, handleBlur)}
                                <div className="form-group">
                                    <Tooltip overlay={getWebsocketPortTip(values.remoteConnect)}>
                                        <label>
                                            WS Port <span className="icon icon-help-circled"></span>
                                        </label>
                                    </Tooltip>
                                    <input
                                        type="text"
                                        name="wsPort"
                                        className="form-control"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.wsPort}
                                    />
                                    {touched.wsPort && errors.wsPort && <div>{errors.wsPort}</div>}
                                </div>
                                <button 
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}>
                                    Submit
                                </button>
                            </form>
                        )}
                    />
            </div>
        )
        
    }
}