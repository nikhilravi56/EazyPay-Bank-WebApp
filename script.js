'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
//Nischith's edit
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(movs);

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// const user = 'Steven Thomas Williams';

const createUsernames = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (ch) {
        return ch[0];
      })
      .join('');
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, ele) => accu + ele, 0);

  labelBalance.textContent = acc.balance + '€';
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(ele => ele > 0)
    .reduce((accu, ele) => accu + ele, 0);
  labelSumIn.textContent = income + '€';
  // console.log(income);
  // console.log(labelSumIn.textContent);

  const spent = acc.movements
    .filter(ele => ele < 0)
    .reduce((accu, ele) => accu + ele, 0);
  labelSumOut.textContent = Math.abs(spent) + '€';

  const interest = acc.movements
    .filter(ele => ele > 0)
    .map(ele => (ele * acc.interestRate) / 100)
    .filter(ele => ele > 1)
    .reduce((accu, x) => accu + x, 0);
  labelSumInterest.textContent = interest + '€';
};
// calcDisplaySummary(account1.movements);

const updateUI = function (acc) {
  // displaying movements
  displayMovements(acc.movements);
  // displaying balance
  calcDisplayBalance(acc);
  // displaying summary
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // clearing input field boxes
    inputLoginUsername.value = inputLoginPin.value = '';
    // removing focus/cursor from pin box
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // displaying UI and welcome message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
    // console.log(currentAccount.owner);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('Transfer possible');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(ele => ele >= 0.1 * amount)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeAcc = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  const pin = Number(inputClosePin.value);
  console.log(closeAcc, pin);
  inputClosePin.value = inputCloseUsername.value = '';
  if (closeAcc === currentAccount && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log('Deletion possible', accounts);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// let userID = '';
// const id = username.map(function (ch) {
//   // return ch.slice(0, 1);
//   userID += ch.slice(0, 1);
// });
// console.log(username);
// console.log(id);
// console.log(userID);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const a = [15, 25, 35, 45, 55, 65, 75, 85];

// a.forEach(function (ele, i, arr) {
//   console.log(`Element at ${i + 1} position: ${ele}`);
//   console.log(`Array: ${arr}`);
// });

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const conv = 2;
const movementsConv = movements.map(x => x * 2);

// console.log(movementsConv);

const deposits = movements.filter(function (ele) {
  return ele > 0;
});
const withdrawals = movements.filter(ele => ele < 0);
// console.log(deposits, withdrawals);

// const balance = movements.reduce(function (sum, ele, i, arr) {
//   console.log(sum, ele, i, arr);
//   return sum + ele;
// }, 0);
// console.log(balance);

// labelBalance.textContent = balance + '€';

const max = movements.reduce(
  (accu, ele) => (accu > ele ? accu : ele),
  movements[0]
);
// console.log(max);

// let humanAge = [];
// const calcAverageHumanAge = function (ages) {
//   // let puppy = ages.filter(dog => dog <= 2);
//   // let adult = ages.filter(dog => dog > 2);
//   // console.log(puppy, adult);
//   // puppy = puppy.map(x => x * 2);
//   // adult = adult.map(x => 16 + x * 4);
//   // console.log(puppy, adult);
//   // puppy = puppy.filter(x => x >= 18);
//   // adult = adult.filter(x => x >= 18);
//   // console.log(puppy, adult);
//   // humanAge = [...puppy, ...adult];
//   // let avg = humanAge.reduce((accu, x) => accu + x, 0);
//   // avg /= humanAge.length;
//   // console.log('Average age:' + avg);

// const humanAge = ages.map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4));
// const adult = humanAge.filter(dog => dog >= 18);
// let avg = adult.reduce((accu, x) => accu + x, 0) / adult.length;
// console.log(humanAge, adult, avg);

//   const humanAge = ages
//     .map(dog => (dog <= 2 ? dog * 2 : 16 + dog * 4))
//     .filter(dog => dog >= 18)
//     .reduce((accu, x, i, arr) => accu + x / arr.length, 0);

//   console.log(humanAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const totalUSDDeposits = movements
  .filter(ele => ele > 0)
  .map(ele => ele * 1.1)
  .reduce((accu, ele) => accu + ele, 0);
// console.log(totalUSDDeposits);

// const findAccount = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(findAccount);
// console.log(account4.movements.every(ele => ele > 0));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance1 = allMovements.reduce((accu, ele) => accu + ele, 0);
// console.log(overallBalance1);

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((accu, ele) => accu + ele, 0);
// console.log(overallBalance);

const diceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
// console.log(diceRolls);

// Coding challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
// console.log(dogs);

// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.recommendedFood > dogSarah.curFood ? 'little' : 'much'
  }`
);

// 3
// const ownersEatTooMuch = [],ownersEatTooLittle=[];
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too less!`);

// 5
console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));

// 6
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7
console.log(dogs.filter(checkEatingOkay));

// 8
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
