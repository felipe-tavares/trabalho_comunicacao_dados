/*OQ ESSE PROJETO DEVE FAZER?
ler valores do pulso, quando clicar no botão send,
se o pulso for valido, ascender led builtin e enviar inputs min e max ao servidor,
se o pulso for invalido, apagar led builtin e enviar inputs min e max ao servidor,
ao clicar no botao sort, vai ser sorteado um valor, que será mostrado na tela,
se o pulso estiver como validado (built in ligado), vai ascender led vermelho,
caso contrario, os leds se manterão apagados
*/

import React from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
} from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial'

export default class App extends React.Component {
	constructor (props) {
		super(props)
		
		this.state = {
			isEnabled: false,
			discovering: false,
			devices: [],
			unpairedDevices: [],
			connected: false,
            max: '',
            post: '',
            result: '',
			data: '',
			responseToPost: '',
		}
	}
	
	onChangeHandler(field, value) {
        this.setState({ [field]: value });
    }
	
	//sort is now working!
	//obs: change fetch to your default ip address
	callApiSort = async () => {
        const result = await fetch('http://192.168.0.106:5000/api/sort');
        const body = await result.json();
        if (result.status !== 200) throw Error(body.message);

        return body;
    };
	
	//post max is now working!
	//obs: change fetch to your default ip address
	handleTimbus = async () => {//sent value max to server
        
        const response = await fetch('http://192.168.0.106:5000/api/num2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.max }),
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
		return body;
    };
	
	componentDidMount() {
		Promise.all([
			BluetoothSerial.isEnabled(),
			BluetoothSerial.list()
		])
		.then((values) => {
			const [isEnabled, devices] = values
			this.setState({ isEnabled, devices })
		});
		
		BluetoothSerial.on('bluetoothEnabled', () => {
			Promise.all([
				BluetoothSerial.isEnabled(),
				BluetoothSerial.list()
			])
			.then((values) => {
				const [ devices ] = values
				this.setState({ devices })
			});
			
			BluetoothSerial.on('bluetoothDisabled', () => {
				this.setState({ devices: [] })
			});
			
			BluetoothSerial.on('error', (err) => console.log('Error: ${err.message}'))
		});
	}
	
	toggleBluetooth(value) {
		if (value === true) {
			this.enable()
		} else {
			this.disable()
		}
	}
	
	enable() {
		BluetoothSerial.enable()
		.then((res) => this.setState({isEnabled: true}))
		.catch((err) => Toast.showShortBottom(err.message))
	}
	
	disable() {
		BluetoothSerial.disable()
		.then((res) => this.setState({isEnabled: false}))
		.catch((err) => Toast.showShortBottom(err.message))
	}
	
	discoverAvailableDevices() {
		if (this.state.discovering) {
			return false;
		}
		else {
			this.setState({discovering: true});
			
			BluetoothSerial.discoverUnpairedDevices()
			.then((unpairedDevices) => {
				const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
				console.log(uniqueDevices);
				this.setState({ unpairedDevices: uniqueDevices, discovering: false })
			})
			.catch((err) => console.log(err.message))
		}
	}
	
	activeGreenLed() {//test heartbeat then send min and max to server
		
		BluetoothSerial.write("0")//enable heartbeat test
		.then((res) => {
			console.log(res);
			console.log('Successfuly wrote to device')
			this.setState({ connected: true })
			
			this.handleTimbus()
			.then(res => this.setState({ responseToPost: res.express }))
			.catch(err => console.log(err))
		})
		.catch((err) => console.log(err.message))
		
	}
	
	activeRedLed() {//receive value from server, print this value, then notify embedded system
		this.callApiSort()
		.then(res => this.setState({ result: res.express }))
		.catch(err => console.log(err))
		
		BluetoothSerial.write("1")//turn on red led
		.then((res) => {
			console.log(res);
			console.log('Successfuly wrote to device')
			this.setState({ connected: true })
		})
		.catch((err) => console.log(err.message))
	}
	
	connect(device) {
		this.setState({ connecting: true});
		
		BluetoothSerial.connect(device.id)
		.then((res) => {
			console.log('Connected to device ${device.name}');
			ToastAndroid.show('Connected to device ${device.name}', ToastAndroid.SHORT);
		})
		.catch((err) => console.log(err.message))
	}
	
	renderDevices(item) {
		return (
			<TouchableOpacity onPress={() => this.connect(item.item)}>
				<View style={styles.deviceNameWrap}>
					<Text style={styles.deviceName}>
						{item.item.name ? item.item.name : item.item.id }
					</Text>
				</View>
			</TouchableOpacity>
		)
	}
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
					<View style={styles.toolbarButton}>
						<Switch
							value={this.state.isEnabled}
							onValueChange={(val) => this.toggleBluetooth(val)}
						/>
					</View>
				</View>
				
				<Button
				onPress={this.discoverAvailableDevices.bind(this)}
				title="Scan for Devices"
				color="#841584"
				/>
				
				<FlatList
				style={{flex:1}}
				data={this.state.devices}
				keyExtractor={item => item.id}
				renderItem={(item) => this.renderDevices(item)}
				/>
				
				<View style={styles.container} />
				
				<TextInput
					style={styles.inputs}
					placeholder="input max value"
					type="text"
					value={this.state.max}
					onChangeText={value => this.onChangeHandler('max', value)}
				/>
				
				<View style={styles.container} />
				
				<View>
					<Text style={{ color: 'red', fontSize: 20 }} >{this.state.responseToPost}</Text>
				</View>
				
				<View>
					<Text style={{ color: 'red', fontSize: 20 }} >{this.state.result}</Text>
				</View>
				
				<Button
				onPress={this.activeGreenLed.bind(this)}
				title="Send SORT"
				color="#287731"
				/>
				
				<Button
				onPress={this.activeRedLed.bind(this)}
				title="SORT"
				color="#aa3443"
				/>
			</View>
		)
	}
	
}

const styles = StyleSheet.create({
  container: {
	  flex: 1,
	  backgroundColor: '#F5FCFF',
	  paddingBottom: 10,
  },
  inputs: {
	textAlign:'center',
	//paddingLeft: 160,
	fontSize: 25,
	color: "red"
  },
  toolbar: {
	  paddingTop: 30,
	  paddingBottom: 30,
	  flexDirection: 'row'
  },
  toolbarButton: {
	  width: 50,
	  marginTop: 8,
  },
  toolbarTitle: {
	  textAlign: 'center',
	  fontWeight: 'bold',
	  fontSize: 20,
	  flex: 1,
	  marginTop: 6
  },
  deviceName: {
	  fontSize: 17,
	  color: "black"
  },
  deviceNameWrap: {
	  margin: 10,
	  borderBottomWidth: 1
  },
});