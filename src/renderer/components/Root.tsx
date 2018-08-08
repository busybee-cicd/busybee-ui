import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import TestRunFormContainer from '../containers/TestRunFormContainer';
import TestRunViewContainer from '../containers/TestRunViewContainer';
import { NavLocation } from '../../shared/enums/NavLocation';
import * as classnames from 'classnames';

interface RootProps {
    db:Connection|null,
    navLocation:NavLocation,
    fetchDb: () => void,
    listenForBusybeeMessages: () => void,
    navigate: (state:NavLocation) => void
}

export class Root extends React.Component<RootProps, any> {
    
    componentDidMount() {
        this.props.fetchDb();
        this.props.listenForBusybeeMessages();
    }
    
    handleNavigate(navLocation:NavLocation, e:MouseEvent) {
        this.props.navigate(navLocation);
    }
    
    render(): any {
        let Content;
        let runTestBtnClasses = classnames('btn btn-default', {'active': this.props.navLocation === NavLocation.TEST_RUN});
        let liveViewBtnClasses = classnames('btn btn-default', {'active': this.props.navLocation === NavLocation.LIVE_VIEW});
        
        if (!this.props.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            Content = <TestRunFormContainer />;
            switch (this.props.navLocation) {
                case NavLocation.TEST_RUN:
                    break;
                case NavLocation.LIVE_VIEW:
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
                            <button className={runTestBtnClasses} onClick={this.handleNavigate.bind(this, NavLocation.TEST_RUN)}>
                                <span className="icon icon-shuffle icon-text"></span>
                                Run Test
                            </button>
                            <button className={liveViewBtnClasses} onClick={this.handleNavigate.bind(this, NavLocation.LIVE_VIEW)}>
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