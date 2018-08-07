import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import TestRunFormContainer from '../containers/TestRunFormContainer';
import TestRunViewContainer from '../containers/TestRunViewContainer';
import {NavState} from '../../shared/enums/NavState';
import * as classnames from 'classnames';

interface RootProps {
    db:Connection|null,
    navState:NavState,
    fetchDb: () => void,
    listenForBusybeeMessages: () => void,
    navigate: (state:NavState) => void
}

export class Root extends React.Component<RootProps, any> {
    
    componentDidMount() {
        this.props.fetchDb();
        this.props.listenForBusybeeMessages();
    }
    
    handleNavigate(navState:NavState, e:MouseEvent) {
        this.props.navigate(navState);
    }
    
    render(): any {
        let Content;
        let runTestBtnClasses = classnames('btn btn-default', {'active': this.props.navState === NavState.TEST_RUN});
        let liveViewBtnClasses = classnames('btn btn-default', {'active': this.props.navState === NavState.LIVE_VIEW});
        
        if (!this.props.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            Content = <TestRunFormContainer />;
            switch (this.props.navState) {
                case NavState.TEST_RUN:
                    break;
                case NavState.LIVE_VIEW:
                    Content = <TestRunViewContainer />;
                    break;
                default:
                    break;
            }
        }
        
        return(
            <div className="w-100 h-100">
                <header className="toolbar toolbar-header draggable">
                    <h1 className="title">Busybee UI</h1>
                    <div className="toolbar-actions">
                        <div className="btn-group">
                            <button className={runTestBtnClasses} onClick={this.handleNavigate.bind(this, NavState.TEST_RUN)}>
                                <span className="icon icon-shuffle icon-text"></span>
                                Run Test
                            </button>
                            <button className={liveViewBtnClasses} onClick={this.handleNavigate.bind(this, NavState.LIVE_VIEW)}>
                                <span className="icon icon-cloud icon-text"></span>
                                Live View
                            </button>
                        </div>
                    </div>
                </header>
                <div className="window-content w-100 h-100 d-flex justify-content-center align-items-center">
                    {Content}
                </div>
            </div>
        )
    }
}