import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import RunTestFormContainer from '../containers/RunTestFormContainer';
import RunTestViewContainer from '../containers/RunTestViewContainer';
import {NavState} from '../../shared/enums/NavState';
import * as classnames from 'classnames';

interface RootProps {
    db:Connection,
    navState:NavState,
    fetchDb: () => {},
    listenForBusybeeMessages: () => {},
    navigate: (state:NavState) => {}
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
        let runTestBtnClasses = classnames('btn btn-default', {'active': this.props.navState === NavState.RUN_TEST});
        let liveViewBtnClasses = classnames('btn btn-default', {'active': this.props.navState === NavState.LIVE_VIEW});
        
        if (!this.props.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            switch (this.props.navState) {
                case NavState.RUN_TEST:
                    Content = <RunTestFormContainer />;
                    break;
                case NavState.LIVE_VIEW:
                    Content = <RunTestViewContainer />;
                    break;
                default:
                    Content = <RunTestFormContainer />;
                    break;
            }
        }
        
        return(
            <div className="w-100 h-100">
                <header className="toolbar toolbar-header draggable">
                    <h1 className="title">Busybee UI</h1>
                    <div className="toolbar-actions">
                        <div className="btn-group">
                            <button className={runTestBtnClasses} onClick={this.handleNavigate.bind(this, NavState.RUN_TEST)}>
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