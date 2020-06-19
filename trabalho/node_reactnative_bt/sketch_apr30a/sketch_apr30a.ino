
#include "DFRobot_Heartrate.h"
#include "SoftwareSerial.h"

#define heartratePin A0

DFRobot_Heartrate heartrate(DIGITAL_MODE);

SoftwareSerial bluetooth(2, 3); //TX, RX
const int ledVermelho = 10;
const int ledOrange = 13;

void setup() {
  Serial.begin(9600);
  Serial.println(F("Type the AT commands:"));

  //Polarizacao invertida...
  pinMode(ledVermelho, OUTPUT);
  pinMode(ledOrange, OUTPUT);

  digitalWrite(ledVermelho, 0);
  digitalWrite(ledOrange, 0);

  bluetooth.begin(9600);
}

void loop() {//pra testar sem sensor, atribuir 1 ao rateValue e comentar as outras duas linhas logo a frente
  uint8_t rateValue;
  heartrate.getValue(heartratePin); ///< A1 foot sampled values
  rateValue = heartrate.getRate(); ///< Get heart rate value 

  if (Serial.available()) {
    char r = Serial.read();
    bluetooth.print(r);
    Serial.println(r);
  }

  if (bluetooth.available()) {
    char r = bluetooth.read();
    Serial.println(r);

    if (r == '0') {//primeiro botao (send pulso)
      Serial.println("Enviando sua SORTe...");
      digitalWrite(ledVermelho, 0);
      if(rateValue)
      {
        digitalWrite(ledOrange, 1); //pulso valido
        //bluetooth.write(rateValue); n tem read :(
        Serial.println("Sorte enviada! analisando...");
      }else{//pulso invalido
        Serial.println("Sem sorte... Tente novamente!");
        digitalWrite(ledOrange, 0); //pulso invalido
      }
    } else if (r == '1') {//segundo botao (ascende led vermelho)
      if(digitalRead(ledOrange)){
        Serial.println("SORTe recebida!");
        digitalWrite(ledVermelho, 1);
      }
    }
  }

  delay(20);
}
