# svelte-calendar

A fork of svelte-calendar, as the origin project seemed pretty inactive (basically dead).

A small date picker built with Svelte 3. Demo available here: [demo page].

## Installation

```sh
npm i -D svelte-calendar
```

## Basic usage

```html
<script>
  import Datepicker from 'svelte-calendar';
</script>

<Datepicker start={minDate} end={maxDate} />
```

## Props

prop name            | type                   | default
---------------------|------------------------|-------------------------
`start`              | `date`                 | one year in past
`end`                | `date`                 | one year in future
`selected`           | `date`                 | `today`
`formattedSelected`  | `string`               | `today`
`dateChosen`         | `boolean`              | `false`
`selectableCallback` | `function`             | `null`
`format`             | `string` \| `function` | `'#{m}/#{d}/#{Y}'`
`daysOfWeek`         | `array`                | En-US Locale (see below)
`monthsOfYear`       | `array`                | En-US Locale (see below)
`style`              | `string`               | ""

### `start` and `end`
These properties set the minimum and maximum dates that will be rendered by this calendar.  It is recommended that you do not leave these as their defaults and supply values which suit your application's needs.

### `selected` and `formattedSelected`
Bind to these properties to observe the selected date as either a date or a string.  Use `selected` to set the day which is selected by default.

### `dateChosen`
Bind to this property to observe whether a user has selected a day.

### `selectableCallback`
Provide a function which accepts a date and returns a boolean determining whether a day between `start` and `end` is selectable.  For example, use this to prevent weekend days from being selected.

### `format`
Date formatting uses [`timeUtils`] formatting (MM/DD/YYYY by default).  If you would like to use a different formatting library, supply a function which accepts a date and returns a string.

### `daysOfWeek` and `monthsOfYear`
These two props are used to internationalize the calendar.  The default values are:

```javascript
export let daysOfWeek = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

export let monthsOfYear = [
  ['January', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May', 'May'],
  ['June', 'Jun'],
  ['July', 'Jul'],
  ['August', 'Aug'],
  ['September', 'Sep'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec']
];
```

### `style`
This prop allows you to style the div which wraps the Datepicker component.  This can be useful, for instance, if you'd like to do something like make the component full-width or `display: block;` (by default the element is `inline-block`).  If you would like to style the button that triggers the opening of the datepicker we recommend you pass a custom element (button/link/etc) to the component via its default slot.

### Kitchen Sink Example:
```html
<script>
  const daysOfWeek = [
    [ 'Domingo', 'Dom' ],
    [ 'Lunes', 'Lun' ],
    [ 'Martes', 'Mar' ],
    [ 'Miércoles', 'Mié' ],
    [ 'Jueves', 'Jue' ],
    [ 'Viernes', 'Vie' ],
    [ 'Sábado', 'Sáb' ],
  ];
  const monthsOfYear = [
    [ 'Enero', 'Ene' ],
    [ 'Febrero', 'Feb' ],
    [ 'Marzo', 'Mar' ],
    [ 'Abril', 'Abr' ],
    [ 'Mayo', 'May' ],
    [ 'Junio', 'Jun' ],
    [ 'Julio', 'Jul' ],
    [ 'Agosto', 'Ago' ],
    [ 'Septiembre', 'Sep' ],
    [ 'Octubre', 'Oct' ],
    [ 'Noviembre', 'Nov' ],
    [ 'Diciembre', 'Dic' ],
  ];
</script>

<Datepicker
  bind:formattedSelected={selectedDateFormatted}
  bind:selected={selectedDate}
  bind:dateChosen={userHasChosenDate}
  start={threeDaysInPast}
  end={inThirtyDays}
  selectableCallback={filterWeekends}
  daysOfWeek={daysOfWeek}
  monthsOfYear={monthsOfYear}
  format={date => dayjs(date).format('DD/MM/YYYY')}
/>
```

## Developing/Modifying Svelte-Calendar Guide

Getting started is as easy as forking, installing, and starting the snowpack dev server.

```bash
git clone https://github.com/Sanshain/sve-calendar.git
cd svelte-calendar
npm install
npm run dev
```

(Note that installing dependencies, as well as the first start may take some time, as well as loading the
page may take some time.)

Head to [localhost:8000] in your browser. It should open automatically.
You should see the demo page running. Edit a component file in `src`, save it, and your browser will reload the page so you can see your changes automatically.


## Contributing

Do feel free to apply your patches, suggestions and PRs to the [upstream] as well as this fork. However, don't be surprised if
upstream doesn't react. After all, the only reason this fork exists, is to try to resurrect this project. If at some time the
upstream comes back alive, I'd be happy to help merge any changes back.



[demo page]: https://phaqui.github.io/svelte-calendar-resurrected/
[`timeUtils`]: https://github.com/6eDesign/timeUtils
[`Date`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Node.js]: https://nodejs.org
[Rollup]: https://rollupjs.org
[localhost:8000]: http://localhost:8000
[upstream]: https://6edesign.github.io/svelte-calendar/
