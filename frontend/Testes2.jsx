'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Card, Button, Input, Table } from 'antd';

class This extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        username: '',
        name: '',
    };

    clickButton = e => {
        //console.log(this.state);
    };

    changeInput = field => e => {
        this.setState({
            [field]: e.target.value,
        });
    };

    render() {
        return (
            <div
                style={{
                    border: '1px solid red',
                    //height: '100vh',
                    display: 'flex',
                    //flexDirection: 'column',
                }}
            >
                <Input type="text" onChange={this.changeInput('username')} value={this.state.username} />
                <br />
                <Input type="text" onChange={this.changeInput('name')} value={this.state.name} />
                <br />
                <Button onClick={this.clickButton}>click2</Button>
            </div>
        );
    }
}

export default This;
