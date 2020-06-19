/*OQ ESSE PROJETO DEVE FAZER?
ler valores do pulso, quando clicar no botão send, enviar um desses valores para o max
ao clicar no botao sort, vai ser sorteado um valor, mostrado na tela, e vai ascender o led
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
            response: '',
            post: '',
            result: '',
			data: '',
		}
	}
	
	callApiSort = async () => {
        const result = await fetch('/api/sort');
        const body = await result.json();
        if (result.status !== 200) throw Error(body.message);

        return body;
    };
	
	handleTimbus = async f => {//envia valor max ao server
        f.preventDefault();
        const response = await fetch('/api/num2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.max }),
        });
        const body = await response.text();

        this.setState({ max: body });
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
	
	activeGreenLed() {//receber valor do arduino e enviar ao max do servidor
		BluetoothSerial.write("0")//ativa o teste de pulso
		.then((res) => {
			console.log(res);
			console.log('Successfuly wrote to device')
			this.setState({ connected: true })
			//nenhuma funcionou :(
			/*BluetoothSerial.on('read', data => { //esse aki existe mas n sei sobre o 'read'
				console.log(`DATA FROM BLUETOOTH: ${data.data}`);
				ToastAndroid.show('received data from device: ${data.data}', ToastAndroid.SHORT);
			});/*
			BluetoothSerial.read((data, subscription) => {//esse aki n existe mas da pra testar
				console.log(data);
				ToastAndroid.show('received data from device: ${data.data}', ToastAndroid.SHORT);
			},);*/
			this.handleTimbus;
		})
		.catch((err) => console.log(err.message))
	}
	
	activeRedLed() {//recebe valor do server, printa esse valor, e avisa ao embarcado
		//callApiSort() 
		this.callApiSort() 
		.then(res => this.setState({ result: res.express }))
		.catch(err => console.log(err))
		
		BluetoothSerial.write("1")//ascende red led
		.then((res) => {
			console.log(res);
			console.log('Successfuly wrote to device')
			this.setState({ connected: true })
		})
		.catch((err) => console.log(err.message))
		
		return (
			<View>
				<Text style={{ color: 'red', fontSize: 20 }} >{this.state.result}</Text>
			</View>
		)
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
					placeholder="Your best lucky"
					type="text"
					value={this.state.max}
					onChange={f => this.setState({ max: f.target.value })}
				/>
				<View style={styles.container} />
				
				<TextInput
					style={styles.inputs}
					placeholder="what you've got"
					type="text"
					value={this.state.result}
					onChange={e => this.setState({ result: e.target.value })}
				/>
				
				<Button
				onPress={this.activeGreenLed.bind(this)}
				title="Send SORTe"
				color="#287731"
				/>
				
				<Button
				onPress={this.activeRedLed.bind(this)}
				title="SORTear"
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
	paddingLeft: 85,
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
  btn: {
        paddingTop: 20,
        fontSize: 11,
  }
});