import * as React from 'react';
import './Root.scss';
import { NavLocation } from '../../shared/enums/NavLocation';
import * as classNames from 'classnames';
import 'react-toastify/dist/ReactToastify.css';

interface ToolBarProps {
    navLocation:NavLocation,
    log: string[],
    navigate: (state:NavLocation) => void,
    setCurrentTestRunId: (runId: string|null) => void
}

export class ToolBar extends React.Component<ToolBarProps, any> {

    handleNavigate(navLocation:NavLocation, e:MouseEvent) {
        this.props.navigate(navLocation);
    }

    getRunTestNav() {
        const onClick = (navLocation:NavLocation, e:MouseEvent) => {
            this.props.setCurrentTestRunId(null);
            this.handleNavigate(navLocation, e);
        };

        let classes = classNames('btn btn-default', {'active': this.props.navLocation === NavLocation.TEST_RUN});

        return  (
            <button className={classes} onClick={onClick.bind(this, NavLocation.TEST_RUN)}>
                <span className="icon icon-shuffle icon-text"></span>
                Run Test
            </button>
        );
    }

    getRunTestResultsNav() {
        const onClick = (navLocation:NavLocation, e:MouseEvent) => {
            this.handleNavigate(navLocation, e);
        };

        let classes = classNames('btn btn-default', {'active': this.props.navLocation === NavLocation.TEST_RESULTS});

        return  (
            <button className={classes} onClick={onClick.bind(this, NavLocation.TEST_RESULTS)}>
                <span className="icon icon-newspaper icon-text"></span>
                Test Results
            </button>
        );
    }

    getLogConsoleNav() {
        if (this.props.log.length < 1) return;

        const onClick = (navLocation:NavLocation, e:MouseEvent) => {
            this.handleNavigate(navLocation, e);
        };

        let classes = classNames('btn btn-default', {'active': this.props.navLocation === NavLocation.LOG_CONSOLE});

        return  (
            <button className={classes} onClick={onClick.bind(this, NavLocation.LOG_CONSOLE)}>
                <span className="icon icon-info-circled icon-text"></span>
               Logs
            </button>
        );
    }
    
    render(): any {
        return(
            <div className="toolbar-actions">
                <div className='btn-group pull-right'>
                    {this.getRunTestNav()}
                    {this.getRunTestResultsNav()}
                    {this.getLogConsoleNav()}
                </div>
            </div>
        )
    }
}