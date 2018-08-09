import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import TestRunViewContainer from '../containers/test/TestRunViewContainer';
import { NavLocation } from '../../shared/enums/NavLocation';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastMessageI } from '../../shared/models/ToastMessageI';

interface RootProps {
    runId: string|null,
    db:Connection|null,
    navLocation:NavLocation,
    toast: ToastMessageI | null,
    dismissToast: () => void,
    fetchDb: () => void,
    listenForBusybeeMessages: () => void,
    navigate: (state:NavLocation) => void,
    setCurrentTestRunId: (runId: string|null) => void
}

export class Root extends React.Component<RootProps, any> {
    
    componentDidMount() {
        this.props.fetchDb();
        this.props.listenForBusybeeMessages();
    }
    
    componentDidUpdate() {
        if (this.props.toast) {
            let _toast:any = toast;
            _toast[this.props.toast.level.toString()](
                this.props.toast.value,
                {
                    onClose: () => (this.props.dismissToast()),
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: false
                }
            );
        }
    }

    handleNavigate(navLocation:NavLocation, e:MouseEvent) {
        this.props.navigate(navLocation);
    }

    getRunTestNav() {
        let RunTestNav;
        const onClick = (navLocation:NavLocation, e:MouseEvent) => {
            this.props.setCurrentTestRunId(null);
            this.handleNavigate(navLocation, e);
        };

        if (this.props.runId !== null) {
            let runTestBtnClasses = classNames('btn btn-default', {'active': this.props.navLocation === NavLocation.TEST_RUN});

            RunTestNav = (
                <button className={runTestBtnClasses} onClick={onClick.bind(this, NavLocation.TEST_RUN)}>
                    <span className="icon icon-shuffle icon-text"></span>
                    Run Test
                </button>
            );
        }

        return RunTestNav;
    }
    
    render(): any {
        let Content;
        
        //let liveViewBtnClasses = classnames('btn btn-default', {'active': this.props.navLocation === NavLocation.LIVE_VIEW});
        
        if (!this.props.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            Content = <TestRunViewContainer />;
            switch (this.props.navLocation) {
                case NavLocation.TEST_RUN:
                    break;
                default:
                    break;
            }
        }

        let RunTestNav = this.getRunTestNav();
        let navItems = [RunTestNav];

        let navClasses = classNames({
            'btn-group': _.filter(navItems, (i) => { i !== undefined }).length > 1 ? true : false,
            'pull-right': true
        })
        return(
            <div className="w-100 h-100">
                <header className="toolbar toolbar-header draggable">
                    <h1 className="title">Busybee UI</h1>
                    <div className="toolbar-actions">
                        <div className={navClasses}>
                            {this.getRunTestNav()}
                            {/* <button className={liveViewBtnClasses} onClick={this.handleNavigate.bind(this, NavLocation.LIVE_VIEW)}>
                                <span className="icon icon-cloud icon-text"></span>
                                Live View
                            </button> */}
                        </div>
                    </div>
                </header>
                <div className="window-content w-100 h-100 d-flex justify-content-center align-items-center">
                    {Content}
                </div>
                <ToastContainer />
            </div>
        )
    }
}