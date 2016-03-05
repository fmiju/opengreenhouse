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

unsigned int getWindSpeed(){
  long newPosition = myEnc.read();
  if (newPosition != oldPosition) {
    oldPosition = newPosition;
  }
  return newPosition;
}

void loop() {
  temp = readI2CRegister16bit(0x21, 5);
  temp = temp/10;
  moisture = readI2CRegister16bit(0x21, 0) 
  wind_speed = getWindSpeed();
  light_level = writeI2CRegister8bit(0x21, 3); //request light measurement 
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
  rotateStepper(temp); 
  delay(1000);



}
