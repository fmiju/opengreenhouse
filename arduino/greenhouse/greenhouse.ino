#include <TimerOne.h>
#include <Wire.h>
#include <Encoder.h>
Encoder myEnc(2, 3);

int directionPin = 4;
int stepPin = 5;
//int numberOfSteps = 480;
int pulseWidthMicros = 1000;  // microseconds
int timerPeriod = 500000; // microseconds
int millisbetweenSteps = 10; // milliseconds
volatile int stepperDelta = 0;
long oldPosition  = -999;

void setup() {
  Timer1.initialize(timerPeriod);
  Timer1.attachInterrupt(pulseStepper);
  Wire.begin();
  Serial.begin(9600);
  writeI2CRegister8bit(0x21, 6); //reset
  pinMode(directionPin, OUTPUT);
  pinMode(stepPin, OUTPUT);

}

//Moisture sensor code
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

void pulseStepper() {

  if (digitalRead(stepPin) == 1) {
    digitalWrite(stepPin, LOW);
  } 
  else if (stepperDelta > 0){
    digitalWrite(directionPin, LOW); 
    digitalWrite(stepPin, HIGH);
    stepperDelta--;
  } 
  else if (stepperDelta < 0){
    digitalWrite(directionPin, HIGH); 
    digitalWrite(stepPin, HIGH);
    stepperDelta++;  
  }
}

unsigned int getWindSpeed(){
  long newPosition = myEnc.read();
  if (newPosition != oldPosition) {
    oldPosition = newPosition;
  }
  return newPosition;
}

void loop() {
  int temp = readI2CRegister16bit(0x21, 5);
  temp = temp/10;
  int moisture = readI2CRegister16bit(0x21, 0);
  int wind_speed = getWindSpeed();
  int light_level = readI2CRegister16bit(0x21, 3); //request light measurement 
  Serial.print("Temperature: ");
  Serial.print(temp); 
  Serial.print("wind speed: ");
  Serial.println(wind_speed);
  Serial.print("moisture: "); //read capacitance register
  Serial.print(moisture);
  Serial.print("light level: "); //read capacitance register
  Serial.println(light_level);  
  Serial.print("window: "); 
  Serial.print("closed");  
  delay(1000);
}


