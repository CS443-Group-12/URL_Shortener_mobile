/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Alert, 
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class Short extends React.Component {
  state = {
      longUrl:'',
      shortenedURL: '',
      modalVisible: false,
      date: '',
      customDate: '',
      showCustom: false,
      dateVisible: false,
      DATE: new Date(),
      editable: false,
      text: 'YYYY/MM/DD',
      customLink: ''

  };


    onChangeText(text){
        this.setState({longUrl: text});
        console.log(this.state.longUrl);
    }

    setModalVisible = () =>{
      this.setState({modalVisible: false});
      console.log(this.state.modalVisible);
    }

    checkTextInput= () =>{
      if(this.state.longUrl == '')
      {
        Alert.alert(
          "Empty Long URL",
          "Please enter valid URL",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }
      else{
        console.log(this.state.longUrl);
        fetch('http://qshift-myproject.192.168.0.20.nip.io/b2c/short', {
          method: 'POST',
          body: JSON.stringify(
          {
            original: this.state.longUrl,
            shortened: '',
            custom: this.state.customLink,
            expiry: this.state.DATE,
          }),
          headers: {"Content-Type": "application/json"}    })
      .then(function(response){
          this.setState({shortenedURL: response.shortened});
      return response.json();    
    })
    .catch(error => 
      {
        console.log("Error in handlepress");
        console.log(error);
      }); 

      this.setState({modalVisible: true});
        /*firebase.database().ref('shortenedurls/'+ID).set(
          {
            url: this.state.longUrl,
            short: 'go.og'
          })
          .then(() => {
            console.log('Inserted');
          })
          .catch((error) => {
            console.log(error);
            console.log('Not inseted');
          });
          firebase.database().ref('shortenedurls').once('value', (data)=> {
            console.log(data.toJSON());
          });

          //firebase.database().ref('shortenedurls/001').update({
           // url: 'gg.com'
          //});
          //firebase.database().ref('shortenedurls/001').remove();
          */
      }
    }
    hide = () =>{
      this.setState({modalVisible: false})
    }
    onChange= (event, selectedDate) =>{
      const date = selectedDate || this.state.DATE;
      this.setState({text: date});
      this.setState({dateVisible: false});
      console.log(this.state.DATE);
    }

  render(){
  return (
    <View>
      <View style={{width:'100%', height: 45, backgroundColor: '#5e6673', flexDirection: 'row',justifyContent: 'space-between'}}>
      <Text style={{fontSize: 30, color: 'white'}}>
        shorten
      </Text>
      <TouchableOpacity style={{alignSelf: 'flex-end'}}><Icon name="menu" size={40} color='white'/></TouchableOpacity>
      </View>
      <View style={{marginTop:30, borderWidth: 1, width: '80%', height:'65%', alignSelf:'center',    
      borderRadius: 4,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      }}>

      <Text style={{fontSize: 70, alignSelf:'center'}}>Welcome!</Text>
      <Text style={{alignSelf:'center'}}> Shorten your long URLs in no time</Text>
      <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width:'80%', 
    alignSelf:'center',
    marginTop: 30
  }}
/>
      <Text style={{alignSelf:'center', marginTop: 30}}>Enter your URL </Text>
      <TextInput 
      style={{width: '80%', height:50, borderColor:'black', borderWidth: 1, alignSelf:'center', borderRadius:7, marginTop: 5}} 
      placeholder="ex: https://github.com"
      onChangeText={text => this.setState({ longUrl: text })}
      value={this.state.longUrl}
      ></TextInput>
      <View style={{flexDirection:'row', justifyContent: 'center', marginTop:3}}>
      <TouchableOpacity style={{alignSelf: 'center', width: '20%', height: '100%', backgroundColor:'blue',borderRadius: 2}} onPress={this.checkTextInput}>
        <Text style={{color:'white', alignSelf: 'center'}}> Shorten </Text>
      </TouchableOpacity>
      <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText} onPress={()=> Linking.openURL(this.state.shortenedURL)}>{this.state.shortenedURL}</Text>

          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
            onPress={this.setModalVisible}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <TouchableOpacity style={{alignSelf: 'center', backgroundColor:'#5e6673', borderRadius: 2, marginLeft: 5}} onPress={() => this.setState({showCustom:true})}>
        <Text style={{fontSize:20, color:'white'}}> ... </Text>
      </TouchableOpacity>

      {this.state.showCustom &&
        <Modal visible={this.state.showCustom}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Custom Link</Text>
        <TextInput style={{borderWidth: 1, width: 300}} onChangeText={(text) => this.setState({customLink: text})}></TextInput>
        <Text>Deadline</Text>
        <TouchableOpacity style={{width: '80%', height: 50, backgroundColor: 'white'}} onPress={()=> this.setState({dateVisible: true})}>
        <TextInput style={{alignSelf:"center"}} editable={this.state.editable}
        value={`${this.state.text}`} onChangeText={(text) => this.setState({text: text})}>
          </TextInput>
        
        </TouchableOpacity>
          {this.state.dateVisible && 
            <DateTimePicker
            testID="dateTimePicker"
            value={this.state.DATE}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={this.onChange}
            minimumDate={new Date(2020, 4, 5)}
          />
          }
          <View style={{marginTop: 5}}>
          <Button title = 'close' onPress={() => this.setState({showCustom: false})}/>
          </View>
    </View>
    </Modal>
      }

      </View>
      </View>
    </View>
  );
};
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


