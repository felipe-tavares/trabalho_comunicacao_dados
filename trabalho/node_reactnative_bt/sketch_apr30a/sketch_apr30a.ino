
#include "DFRobot_Heartrate.h"
#include "SoftwareSerial.h"

#define heartratePin A0

DFRobot_Heartrate heartrate(DIGITAL_MODE);

SoftwareSerial bluetooth(2, 3); //TX, RX
const int ledVermelho = 10;
const int ledVerde = 13;

void setup() {
  Serial.begin(9600);
  Serial.println(F("Type the AT commands:"));

  //Polarizacao invertida...
  pinMode(ledVermelho, OUTPUT);
  pinMode(ledVerde, OUTPUT);

  digitalWrite(10, 1);
  digitalWrite(ledVerde, 1);

  bluetooth.begin(9600);
}

void loop() {
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
      if(rateValue)
      {
        digitalWrite(ledVermelho, 0);
        digitalWrite(ledVerde, 0);
        bluetooth.write(rateValue);
        Serial.println("Sorte enviada! analisando...");
      }else{
        Serial.println("Sem sorte... Tente novamente!");
        digitalWrite(ledVerde, 1);
      }
    } else if (r == '1') {//segundo botao (ascende led vermelho)
      Serial.println("SORTe recebida!");
      digitalWrite(ledVermelho, 1);
    }
  }

  delay(20);
}
