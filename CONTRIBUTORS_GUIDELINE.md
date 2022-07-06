# Structure of /client/src

## api
Here you will find and add all the communication with the backend.
It is expected to not pollute the files from /api/ with business logic.
If you have to do data manipulation, than most probably you'll need a provider that uses the code from /api/.

## app
Under app you will find the application start point, with routes, error handling, authentication.
We are expecting little to no changes to be needed in this area.

## common
Put under common all your reusable elements/components.
You might want to use a separate repository (like racstrap) for elements.
This decision remains at the team's discrection.

## components
Here we will add all our business components.
By component, we understand a piece of code that uses react and it's lifecycles.
We suggest to start your component's name with capital letter and to follow the camelCase convention.

##config
This is the place where you can store application specific configuration.
We are expecting little to no changes to be needed in this area.

##constants
/constants.js file is a good place where you can put your constants (e.g. magic strings, enums, etc).

##types
Gather all your types in /types.ts file.

We recommend to not create new files under constants and types.

##utils
Gather all your utilities to one place, into /utils.ts file.

##context
Here you can put all the contexts you are going to use (and providers also).

##mocks
If you have to mock objects / components that require a lot of boilerplate setup, please consider moving your mock under this directory.

##__tests__
Whenever you write tests, please put them under __tests__ folder that should be at the same level as your tested file.