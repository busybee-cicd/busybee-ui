import * as React from 'react';
import { SyncLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Connection } from 'typeorm';
import { NavLocation } from '../../shared/enums/NavLocation';
import { ToastMessageI } from '../../shared/models/ToastMessageI';
import LogConsoleContainer from '../containers/LogConsoleContainer';
import TestResultsViewContainer from '../containers/test/results/TestResultsViewContainer';
import TestRunViewContainer from '../containers/test/run/TestRunViewContainer';
import ToolbarContainer from '../containers/ToolbarContainer';
import './Root.scss';
// import ToolbarContainer from '../containers/ToolbarContainer';

interface RootProps {
    db:Connection|null,
    toast: ToastMessageI | null,
    navLocation: NavLocation,
    dismissToast: () => void,
    fetchDb: () => void,
    listenForBusybeeMessages: () => void,
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
                case NavLocation.TEST_RESULTS:
                    Content = <TestResultsViewContainer />
                    break;
                case NavLocation.LOG_CONSOLE:
                    Content = <LogConsoleContainer />
                    break;
                default:
                    break;
            }
        }

        return(
            <div className="w-100 h-100">
                <header className="toolbar toolbar-header draggable">
                    <h1 className="title">Busybee UI</h1>
                    {<ToolbarContainer />}
                </header>
                <div className="window-content w-100 h-100 d-flex justify-content-center align-items-center">
                    {Content}
                </div>
                <ToastContainer />
            </div>
        )
    }
}