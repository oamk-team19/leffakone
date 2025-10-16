# Movie Machine

Movie Machine is modern social site for movie lovers! Find likeminded movie geeks, find your old and new favorites and set up movie nights at local Finnkino theaters.

# For developers and contributors

We use [Nodejs](https://nodejs.org/en) on backend, [React](https://react.dev/) for frontend with [MUI](https://mui.com/) and [postgreSQL](https://www.postgresql.org/) for database. To get up and running, you should install Nodejs from their site or repository of your choosing and have PostgreSQL either locally or easily available (Docker being a good choice). Rest should be covered in steps below.

## Backend

Set your `.env` file with help of `.env.example` in server folder. Remeber to get TMDB api key from [TMDB](https://www.themoviedb.org/signup)

```sh
cd server
npm i
npm run dev
```

## Frontend

Set your `.env` file with help of `.env.example` in frontend folder.

```sh
cd frontend
npm i
npm run dev
```

## Styling guide

Install prettier with `npm i` in project root folder and install [prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Optional (but recommended):

- [Format On Save Mode = File](vscode://settings/editor.formatOnSaveMode)
- [Format On Save = Check](vscode://settings/editor.formatOnSave)
- [Default formatter = Prettier - Code Formatter](vscode://settings/editor.defaultFormatter)

Prettier config is in .prettierrc file.

## Testing

Backend has some tests that can be ran. These are currently quite limited in scope, but can be easily expanded. To run the tests the dev server should be first shut down.

```sh
# in server folder
npm run devStart
# in other terminal window:
npm run test
```

## Theming

We use [Rosé Pine](https://rosepinetheme.com/) for beautiful, soft color themes.

## ERD diagram

![ERD-diagram](/images/ERD_final.png)

## Other dokuments 

- [Published project](http://167.99.42.185/) - Up until October 31th

- [Original wireframe](https://app.moqups.com/uw0Fr1CB6zTjlEm0xWESn6jhjYU2lAki/view/page/ad64222d5) - Not up to date

- [Rest API dokumentation](https://documenter.getpostman.com/view/41144299/2sB3QMLUiA)

- [Backlog](https://github.com/orgs/oamk-team19/projects/1/views/1?sortedBy%5Bdirection%5D=desc&sortedBy%5BcolumnId%5D=Status)

- [Hours worked in Excel ](https://unioulu-my.sharepoint.com/:x:/g/personal/c3kapa03_students_oamk_fi/EaIKe_6KvjxLk9AsnjMtwHoBwLqbZT0zQyYn6IRgh9EY-A?e=HLrAU8)

- [Powerpoint presentation](https://unioulu-my.sharepoint.com/:p:/g/personal/c3kapa03_students_oamk_fi/EaxAt-xJv25AngPVV2Ntj6MBZKpsbFD2RMmUts766uh1PQ?e=LLEwHZ)
