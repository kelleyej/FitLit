import { getUserInfo, getAverageSteps, findFriends } from './user';
import { calculateAverageIntake, findIntakeByDay, findIntakeWeek } from './hydration'; 
import { allData, fetchData } from './apiCalls'

//QUERY SELECTORS
const nameDisplay = document.querySelector('h1')
const addressEmail = document.querySelector('#address-email')
const stepsStride = document.querySelector('#steps-stride')
const averageStepDisplay = document.querySelector('h3')
const hydrationWeek = document.querySelector('#hydro-week')
const friendsList = document.querySelector('#friends')

function renderDom(){
  fetchData()
    .then(([info, sleep, hydration]) => {
      const randomUser = getUserInfo(Math.floor(Math.random() * info.users.length), info.users);
      displayPersonalInfo(randomUser);
      displayStepComparison(randomUser, info.users);
      displayHydrationInfo(randomUser, hydration.hydrationData);    
      displayFriends(randomUser, info.users);
    })
}

//EVENT LISTENERS
window.addEventListener('load', renderDom)

// FUNCTIONS
function displayPersonalInfo(randomUser) {
  nameDisplay.innerText = randomUser.name;
  addressEmail.innerHTML = `${randomUser.address} <br></br> ${randomUser.email}` 
  stepsStride.innerHTML = `Stride Length: ${randomUser.strideLength}<br></br>Daily Step Goal: ${randomUser.dailyStepGoal}` 
}

function displayFriends(person, people) {
  const friends = findFriends(person.id, people)
  friends.forEach((friend, index) => {
    if (!index) {
      friendsList.innerHTML = friend;
    } else {
      friendsList.innerHTML += `<br></br>${friend}`
    }
  })
}

function displayStepComparison(randomUser, users) {
  let averageSteps = getAverageSteps(users);
  let differenceInSteps = Math.abs(averageSteps - randomUser.dailyStepGoal); 
  if(averageSteps > randomUser.dailyStepGoal) {
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps less than the average.`
  } else if (averageSteps < randomUser.dailyStepGoal){
    averageStepDisplay.innerText = `Your step goal was ${differenceInSteps} steps more than the average!`
  } else {
    averageStepDisplay.innerText = `Your step goal was equal to the average, congrats!`
  }
}

function displayHydrationInfo(randomUser, hydrationData) {
  const dailyInfo = findIntakeWeek(randomUser.id, hydrationData)
  dailyInfo.forEach((day, index) => {
    if(!index) {
      hydrationWeek.innerHTML = `Today: ${day.numOunces} ounces`;
    } else {
      hydrationWeek.innerHTML += `<br></br>${day.date}: ${day.numOunces} ounces`
    }
  })
}

