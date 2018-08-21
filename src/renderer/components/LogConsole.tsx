import * as React from 'react';
import './Root.scss';
import 'react-toastify/dist/ReactToastify.css';
// import ToolbarContainer from '../containers/ToolbarContainer';

interface LogConsoleProps {
    log: string[]
    clearLog: () => void
}

export class LogConsole extends React.Component<LogConsoleProps, any> {
    
    render(): any {
        let Content = this.props.log.map((l, i) => {
            return (
                <div key={i} className='logRow'>{l}</div>
            )
        });
        return(
            <div style={{padding: 5}} className="w-100 h-100">
                <div style={{padding: '1em 1em', right: 15}} className="position-fixed">
                    <button className='btn btn-danger' onClick={() => {this.props.clearLog()}}>clear</button>
                </div>
                <div className="w-100 h-100">
                    {Content}
                </div>
            </div>
        )
    }
}