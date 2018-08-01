import * as React from 'react';
import './Root.scss';
import { SyncLoader } from 'react-spinners';
import { Connection } from 'typeorm';
import RunTestFormContainer from '../containers/RunTestFormContainer';
import RunTestViewContainer from '../containers/RunTestViewContainer';

interface RootProps {
    db:Connection,
    fetchDb:Function
    listenForBusybeeMessages: Function
}

export class Root extends React.Component<RootProps, any> {
    
    componentDidMount() {
        this.props.fetchDb();
        this.props.listenForBusybeeMessages();
    }
    
    render(): any {
        let Content;
        if (!this.props.db) {
           Content = (
            <SyncLoader
                loading={true} />
           );
        } else {
            Content = (
                <div className="w-100 h-100">
                    <div className="flex-row">
                        <p className='col-sm-12 text-center'>
                            <b>Electron Typescript React Starter</b>  
                        </p>
                    </div>
                    <div className="flex-row">
                        <RunTestFormContainer />
                    </div>
                    <div className="flex-row">
                        <RunTestViewContainer />
                    </div>
                </div>
            );
        }
        
        return(
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                {Content}
            </div>
        )
    }
}