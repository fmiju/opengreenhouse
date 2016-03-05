#include <Wire.h>
#include <Encoder.h>
Encoder myEnc(2, 3);

int directionPin = 4;
int stepPin = 5;
//int numberOfSteps = 480;
int pulseWidthMicros = 1000;  // microseconds
int millisbetweenSteps = 10; // milliseconds
int temp = 0;
long oldPosition  = -999;

void rotateStepper(int numberOfSteps) {
    digitalWrite(directionPin, LOW);
    for(int n = 0; n < numberOfSteps; n++) {
      digitalWrite(stepPin, HIGH);
      delayMicroseconds(pulseWidthMicros); 
      digitalWrite(stepPin, LOW);
      delay(millisbetweenSteps);
      //digitalWrite(ledPin, !digitalRead(ledPin));
  }
  
  delay(2000);
}

void writeI2CRegister8bit(int addr, int value) {
  Wire.beginTransmission(addr);
  Wire.write(value);
  Wire.endTransmission();
}

unsigned int readI2CRegister16bit(int addr, int reg) {
  Wire.beginTransmission(addr);
  Wire.write(reg);
  Wire.endTransmission();
  delay(20);
  Wire.requestFrom(addr, 2);
  unsigned int t = Wire.read() << 8;
  t = t | Wire.read();
  return t;
}

void setup() {
  Wire.begin();
  Serial.begin(9600);
  writeI2CRegister8bit(0x21, 6); //reset
  pinMode(directionPin, OUTPUT);
  pinMode(stepPin, OUTPUT);
 delay(2000);
}

void loop() {
  //Serial.print(readI2CRegister16bit(0x21, 0)); //read capacitance register
  //Serial.print(", ");
  temp = readI2CRegister16bit(0x21, 5);
  temp = temp/10;
  Serial.print("Temperature:");
  Serial.print(temp); //temperature register
  Serial.println();
  Serial.print("Rotating stepper:");
  Serial.print( temp);
  Serial.println();
  rotateStepper(temp);  
  long newPosition = myEnc.read();
  if (newPosition != oldPosition) {
    oldPosition = newPosition;
    Serial.println("Position:");
    Serial.println(newPosition);
    Serial.println();
  }

  //writeI2CRegister8bit(0x21, 3); //request light measurement 
  //Serial.println(readI2CRegister16bit(0x21, 4)); //read light register

}
