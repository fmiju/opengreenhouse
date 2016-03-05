
#include <Wire.h>
#include <Encoder.h>
#include <TimerOne.h>

//int anemometer_length = 
const int led = LED_BUILTIN;
int winDirPin = 4;
int winStepPin = 5;
int doorDirPin = 6;
int doorStepPin = 7;
int timerPeriod = 150000; // microseconds
int millisbetweenSteps = 10; // milliseconds
volatile int windowDelta = 100000;
volatile int doorDelta = 0;
long oldPosition  = -999;

Encoder myEnc(2, 3);

void setup() {
  pinMode(led, OUTPUT);
  Timer1.initialize(timerPeriod);
  Timer1.attachInterrupt(windowStepper);
  //Timer1.attachInterrupt(doorStepper);
  Wire.begin();
  Serial.begin(9600);
  writeI2CRegister8bit(0x21, 6); //reset
  pinMode(winDirPin, OUTPUT);
  pinMode(winStepPin, OUTPUT);
  pinMode(doorDirPin, OUTPUT);
  pinMode(doorStepPin, OUTPUT);
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

//Stepper code
void windowStepper(void) {
  digitalWrite(led, !digitalRead(led)); 
  
  if (digitalRead(winStepPin) == 1) {
    digitalWrite(winStepPin, LOW);
  } 
  else if (windowDelta > 0){
    digitalWrite(winDirPin, LOW); 
    digitalWrite(winStepPin, HIGH);
    windowDelta--;
  } 
  else if (windowDelta < 0){
    digitalWrite(winDirPin, HIGH); 
    digitalWrite(winStepPin, HIGH);
    windowDelta++;  
  }
}

void doorStepper() {
  if (digitalRead(doorStepPin) == 1) {
    digitalWrite(doorStepPin, LOW);
  } 
  else if (doorDelta > 0){
    digitalWrite(doorDirPin, LOW); 
    digitalWrite(doorStepPin, HIGH);
    doorDelta--;
  } 
  else if (doorDelta < 0){
    digitalWrite(doorDirPin, HIGH); 
    digitalWrite(doorStepPin, HIGH);
    doorDelta++;  
  }
}

/*
unsigned int getWindSpeed(){
  long newPosition = myEnc.read();    
  diff = oldPosition - newPosition;
  return wind_speed;
}
*/
void loop() {
 int temp = readI2CRegister16bit(0x21, 5);
  temp = temp/10;
  int moisture = readI2CRegister16bit(0x21, 0);
  //int wind_speed = getWindSpeed();
  int light_level = readI2CRegister16bit(0x21, 3); //request light measurement 
  Serial.print("Temperature: ");
  Serial.print(temp); 
  //Serial.print("wind speed: ");
  //Serial.println(wind_speed);
  Serial.print("moisture: "); //read capacitance register
  Serial.print(moisture);
  Serial.print("light level: "); //read capacitance register
  Serial.println(light_level);   
  delay(1000);
}


