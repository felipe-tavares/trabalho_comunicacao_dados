import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Button } from 'react-native';
import logo from './logo.svg';
import './Screen1.css';

export default class Screen1 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            min: '',
            max: '',
            response: '',
            post: '',
            responseToPost1: '',
            responseToPost2: '',
            result: '',
        };
    }

    callApiSort = async () => {
        const result = await fetch('/api/sort');
        const body = await result.json();
        if (result.status !== 200) throw Error(body.message);

        return body;
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/mensagem');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/num1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.min }),
        });
        const body = await response.text();

        this.setState({ responseToPost1: body });
    };

    handleTimbus = async f => {
        f.preventDefault();
        const response = await fetch('/api/num2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.max }),
        });
        const body = await response.text();

        this.setState({ responseToPost2: body });
    };

    render() {
        return (
            <div className="Screen1">
                <header className="Screen1-header">
                    <img src={logo} className="Screen1-logo" alt="logo" />
                    <h4 className="Screen1-title">Sorteador</h4>
                </header>
                <p className="Screen1-intro">{this.state.response}</p>

                <form onSubmit={this.handleSubmit}>
                    <input
                        placeholder="From: (min number)"
                        type="text"
                        value={this.state.min}
                        onChange={e => this.setState({ min: e.target.value })}
                    />
                    <button type="submit"
                        color='white'
                    >SENTmin
					</button>
                </form>
                <form onSubmit={this.handleTimbus}>
                    <input
                        placeholder="To: (max number)"
                        type="text"
                        value={this.state.max}
                        onChange={f => this.setState({ max: f.target.value })}
                    />
                    <button
                        type="submit"
                        color='white'
                    >SENTmax
					</button>
                </form>
                <p>{this.state.responseToPost1}</p>
                <p>{this.state.responseToPost2}</p>

                <View style={styles.btn}>
                <Button
                    title='SORTEAR'
                    color='#a08af7'
                    onPress={() =>
                        this.callApiSort() 
                        .then(res => this.setState({ result: res.express }))
                        .catch(err => console.log(err))
                    }
                />
                </View>

                <View>
                    <Text style={{ color: 'red', fontSize: 20 }} h1>{this.state.result}</Text>
                </View>

            </div>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        paddingTop: 20,
        fontSize: 11,
    }
});