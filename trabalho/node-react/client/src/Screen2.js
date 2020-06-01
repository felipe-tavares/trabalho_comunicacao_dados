import React, { Component } from 'react';
import { View, Text } from 'react-native';
import logo from './logo.svg';
import './Screen1.css';

export default class Screen2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: '',
            Sort: '',
            response: '',
        };
    }

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));

    }

    callApi = async () => {
        const response = await fetch('/api/sort');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <>
                <div className="Screen1">
                    <header className="Screen1-header">
                        <img src={logo} className="Screen1-logo" alt="logo" />
                        <h4 className="Screen1-title">Numero Sorteado:</h4>
                    </header>
                    
                    <View>
                        <Text style={{ color: 'red' }} h1>{this.state.response}</Text>
                    </View>
                </div>
            </>
        );
    }
};