import * as React from 'react';
import './RunTestForm.scss';

import { Formik } from 'formik';
import { RunTestConfig } from '../../../shared/models/RunTestConfig';
import { WSConnectionInfo } from '../../../shared/models/WSConnectionInfo';

interface RunTestFormProps {
    runTest: (runTestConfig:RunTestConfig) => {};
    testDirPath: string;
    wsHost: string;
    wsPort: number;
}

export class RunTestForm extends React.Component<RunTestFormProps, any> {
    render(){
        return (
            <div className="message col-sm-6 col-offset-3 text-center">
                <Formik
                        initialValues={{
                          testDirPath: this.props.testDirPath,
                          wsHost: this.props.wsHost,
                          wsPort: this.props.wsPort   
                        }}
                        validate={values => {
                            // let errors:any = {};
                            // if (values.name.length < 2) {
                            //     errors.name = 'Name must be greater than 2 characters';
                            // }
                            // return errors;
                            return {};
                        }}
                        onSubmit={(
                            values,
                            { setSubmitting, setErrors }
                        ) => {
                            const wsConnection = new WSConnectionInfo(values.wsHost, values.wsPort);
                            const runConfig = new RunTestConfig(values.testDirPath, wsConnection);
                            this.props.runTest(runConfig);
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
                                <div className="form-group">
                                    <label>WebSocket Host</label>
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
                                <div className="form-group">
                                    <label>WS Port</label>
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