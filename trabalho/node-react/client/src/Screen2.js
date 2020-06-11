import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
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

    acessarScreen1() {
        this.setState({ isLoading: false });
        this.props.navigation.replace('Screen1');//aqui volta pra screen1
    }

    renderButton() {
        if (this.state.isLoading)
            return <ActivityIndicator size="large" style={styles.loading} />;

        return (
            <View style={styles.btn}>
                <Button
                    title='VOLTAR'
                    color='#a08af7'
                    onPress={() => this.acessarScreen1()}
                />
            </View>
        )
    }

    render() {
        return (
            <>
                <div className="Screen1">
                    <header className="Screen1-header">
                        <img src={logo} className="Screen1-logo" alt="logo" />
                        <h4 className="Screen1-title">Numero Sorteado:</h4>
                    </header>

                    <View>
                        <Text style={{ color: 'red', fontSize: 20 }} h1>{this.state.response}</Text>
                    </View>
                    {this.renderButton()}
                </div>
            </>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        elevation: 0.5,
    },
    scrv: {
        backgroundColor: '#2C1526',
    },
    input: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    btn: {
        paddingTop: 20,
        fontSize: 11,
    },
    loading: {
        padding: 20,
    }
});