# wp4-2025-starter
Template voor WP4 opdracht 2025 "RACademic". Vul dit document aan zoals beschreven in eisen rondom opleveren (zie CASUS.md).

# ERD
![erd](https://github.com/user-attachments/assets/eced82d4-8704-4fbf-aeb1-f36faa493961)


# Installatie requirements
## 1. Maak een lokale kloon
Maak een lokale kloon de repository door de code hieronder in de terminal te runnen.
```shell
git clone git@github.com:Rac-Software-Development/wp4-2025-react-1b5-bamischijf.git
```
## 2. Navigeer naar de bamischijf
Navigeer naar het juiste project door het commando hieronder uit te voeren in de terminal.
```shell
cd wp4-2025-react-1b5-bamischijf
```
## 3. Eigen IP
Run het bestand get_current_ip.py zodat er een .env bestand wordt aangemaakt met je eigen IP-adress. Dit .env bestand komt in de backendtest/Racademy/.env. Dit is niet de bedoeling, verplaats dit .env bestand naar de Racademy map die in de root staat. Daarna kan je de lege Racademy map verwijderen.

## 4. Database genereren
Run het bestand database_generator.py zodat er een database wordt aangemaakt.

## 5. Open Docker
Open de Docker Desktopp applicatie op jouw laptop of computer. Mocht je deze nog niet hebben moet je deze even downloaden vanaf het internet.
Dit is de link waar je naartoe moet: https://www.docker.com 

## 6. Voer nog een commando uit in de terminal
```shell
docker-compose up --build
```
## 7. Navigeer naar Racademy
Navigeer naar de juiste map, naar de Racademy map. Doe dit ook in de terminal door het volgende commando uit te voeren.
```shell
cd Racademy
```
## 8. Installeer de juiste dingen
Nu moeten er nog een aantal dingen worden geínstalleerd, doe dit door door de volgende commando's uit te voeren in de terminal.
```shell
npm install --legacy-peer-deps 
```
En daarna deze:
```shell
npx expo start -c
```
## 9. Het openen
Om de applicatie te openen kan je verschillende dingen doen. Om hem op het web te zien moet je nu op 'w' drukken. Als je hem op een mobiel wilt openen moet de Expo Go app downloaden via de AppStore of de Playstore, als dat is gebeurt kan je met je camera de QR-code scannen en openen via de app.

# Inloggegevens

### Admin
#### Gebruikersnaam: john@pork.nl
#### Wachtwoord: halal

### User
#### Gebruikersnaam: 1234567@hr.nl
#### Wachtwoord: lol

# Bronvermelding
- (Using A ScrollView · React Native, 2025)
- (Net Ninja, 2025)
- (Net Ninja, 2020)
- (Themes, z.d.)
- (ChatGPT, z.d.)
- (YouTube, z.d.)
- (Zero Degree Coder, 2024)
- (React Native Profile Examples And Templates, z.d.)
- (Truong, 2024)
- (Markov, 2024)
- (UseContext – React, z.d.)
- (Code With Nomi, 2023)
- (1B2, 2025)

# Bronnenlijst
- Using a ScrollView · React Native. (2025, 14 april). https://reactnative.dev/docs/using-a-scrollview
- Net Ninja. (2025, 9 april). Complete ReAct Native Tutorial #1 - Introduction & Setup (ExPO) [Video]. YouTube. https://www.youtube.com/watch?v=J2j1yk-34OY (hele playlist gebruikt/bekeken maar ik ga niet 29 bronnen toevoegen over hetzelfde)
- Net Ninja. (2020, 21 december). Full React Tutorial #1 - Introduction [Video]. YouTube. https://www.youtube.com/watch?v=j942wKiXFu8 (hele playlist gebruikt/bekeken maar ik ga niet 32 bronnen toevoegen over hetzelfde)
- Themes. (z.d.). https://www.nativewind.dev/docs/guides/themes
- ChatGPT. (z.d.). ChatGPT. https://chatgpt.com (gebruikt voor debuggen)
- YouTube. (z.d.). https://www.youtube.com/shorts/ML0DuF9Qgis
- Zero Degree Coder. (2024, 8 september). Profile Screen in React Native || React Native Profile Screen Design With Light and Dark Theme [Video]. YouTube. https://www.youtube.com/watch?v=o3eaTF2j_IA
- React native profile examples and templates. (z.d.). https://www.bootdey.com/react-native/tagged/profile
- Truong, M. (2024, 13 februari). Simplifying JWT Tokens for a React-Flask Application. Medium. https://medium.com/@meagantruong1/simplifying-jwt-tokens-for-a-react-flask-application-e765b3e290e3
- Markov, S. (2024, 18 november). Fortify your Full-Stack React & React Native App: JWT Authentication and Token Rotation. Medium. https://medium.com/@markovsve/fortify-your-full-stack-react-react-native-app-jwt-authentication-and-token-rotation-ad8c919a412f
- UseContext – React. (z.d.). https://react.dev/reference/react/useContext
- Code With Nomi. (2023, 13 september). 🔴 Login & SignUp UI in React Native Reanimated | React Native Projects | Beginners Tutorial [Video]. YouTube. https://www.youtube.com/watch?v=M8u_w6_o584
- Hulp van groepje 1B2 (Jorik, Tobias en Roan) met het maken van get_current_ip.py en debuggen
