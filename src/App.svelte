<script>
	import hljs from 'highlight.js';
	import Datepicker from './Components/Datepicker.svelte';
	import { onMount } from 'svelte';

	const today = new Date();
	let start = new Date();
	let dateFormat = "#{l}, #{F} #{j}, #{Y}";
	let noWeekendsSelectableCallback = (date) => date.getDay() !== 0 && date.getDay() !== 6;
	let formattedSelected;
	let dateChosen = false;
	let exampleFormatted = false;
	let exampleChosen = false;

	$: end = new Date(start.getTime() + 1000 * 3600 * 24 * 720);

	let threeDaysInPast;
	$: {
	  const date = new Date(today);
	  date.setDate(date.getDate() - 3);
	  threeDaysInPast = date;
	}

	let tomorrow;
	$: {
	  const date = new Date(today);
	  date.setDate(date.getDate() + 1);
	  tomorrow = date;
	}

	let inThirtyDays;
	$: {
	  const date = new Date(start);
	  date.setDate(date.getDate() + 30);
	  inThirtyDays = date;
	}

	function logChoice(date) {
	  // eslint-disable-next-line
	  console.log(`User chose ${date}.`);
	}

	onMount(() => {
      hljs.highlightAll();
      //hljs.initHighlightingOnLoad();
	});


  const spanishDaysOfWeek = [
    [ 'Domingo', 'Dom' ],
    [ 'Lunes', 'Lun' ],
    [ 'Martes', 'Mar' ],
    [ 'Miércoles', 'Mié' ],
    [ 'Jueves', 'Jue' ],
    [ 'Viernes', 'Vie' ],
    [ 'Sábado', 'Sáb' ],
  ];
  const spanishMonthsOfYear = [
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

<h1>svelte-calendar-resurrected</h1>

<blockquote>
  This is a fork of
    <a href="https://github.com/6eDesign/svelte-calendar/issues">
      6eDesign/svelte-calendar</a>. If the upstream repo comes back alive, I'd
  be happy to help merge back the changes.
</blockquote>

<div class="container">
    <h2>Base demo</h2>
	<p>svelte-calendar-resurrected is a simple and lightweight date picker written in Svelte. Here's the most basic example:</p>

    <div class="example">
        <div class="code">
            <pre><code class='html'>
&lt;script&gt;
  import Datepicker from 'svelte-calendar';
&lt;/script&gt;

&lt;Datepicker /&gt;
            </code></pre>
        </div>
        <div class="live">
            <!--<Datepicker format='{dateFormat}' />-->
            <Datepicker />
        </div>
    </div>

	<!-- <Datepicker ref:cal {start} {end} format='mm/dd/yyyy' /> -->

    <h2>Installation</h2>
    <p>npm i -D svelte-calendar</p>


    <h2>Features</h2>
	<p>This component can be used with or without the Svelte compiler.</p>
	<ul>
		<li>Lightweight (~8KB)</li>
		<li>IE11+ Compatible</li>
		<li>Usable as a Svelte component</li>
		<li>Usable with Vanilla JS / &lt;Your Framework Here&gt;</li>
		<li>Can be compiled to a native web component / custom element</li>
		<li>Mobile/thumb friendly</li>
		<li>Keyboard navigation (arrows, pgup/pgdown, tab, esc)</li>
	</ul>

    <h2>Usage (appearance)</h2>


    <h4>Standalone</h4>

    <Datepicker alwaysOpen />








    <h4>Button appearance</h4>

    <p>By default, the component creates a button with the selected date as it's text, written in the some default date format. Clicking on this button triggers the date picker.</p>

    <p>
        Change the appearance of the default trigger button by using the props
        <b>buttonBackgroundColor</b>, <b>buttonTextColor</b>.<br>
        The date format is controlled by the <b>format</b> prop. Note: The date
        format string uses curly braces to do substitution of fields. Therefore,
        you cannot write the date format directly as a string attribute on the
        component, because svelte would try to do it's replacements instead.
    </p>

    <div class="example">
        <div class="code">
            <pre><code class='html'>
&lt;script&gt;
  import Datepicker from 'svelte-calendar';
  let dateFormat = "#&lbrace;l&rbrace;, #&lbrace;F&rbrace; #&lbrace;j&rbrace;, #&lbrace;Y&rbrace;";
&lt;/script&gt;

&lt;Datepicker
  format=&lbrace;dateFormat&rbrace;
  buttonBackgroundColor="#e20074"
  buttonTextColor="white"
/&gt;
            </code></pre>
        </div>
        <div class="live">
            <Datepicker
              format={dateFormat}
              buttonBackgroundColor="#e20074"
              buttonTextColor="white"
            />
        </div>
    </div>

	<h4>Custom button (or other element)</h4>
    <p>
        You can provide your completely own trigger button instead of the
        default one. Simply insert a button element inside of the component markup. It doesn't even have to be a button element, but could be any element you want. That element will in any case still be used as the trigger to open the date picker.
    </p>

    <div class="example">
        <div class="code">
            <pre><code class='html'>
&lt;script&gt;
  import Datepicker from 'svelte-calendar';
  let dateFormat = "#&lbrace;l&rbrace;, #&lbrace;F&rbrace; #&lbrace;j&rbrace;, #&lbrace;Y&rbrace;";
&lt;/script&gt;

&lt;Datepicker
  format=&lbrace;dateFormat&rbrace;
  bind:formattedSelected
  bind:dateChosen
&gt;
  &lt;button class='custom-button'&gt;
    &lbrace;#if &lbrace;dateChosen&rbrace;
      Chosen: &lbrace;formattedSelected&rbrace;
    &lbrace;:else&rbrace;
      Pick a date
    &lbrace;/if&rbrace;
  &lt;/button&gt;
&lt;/Datepicker&gt;
            </code></pre>
        </div>

        <div class="live">
            <Datepicker format={dateFormat} bind:formattedSelected bind:dateChosen>
                <button class='custom-button'>
                    {#if dateChosen} Chosen: {formattedSelected} {:else} Pick a date {/if}
                </button>
            </Datepicker>
        </div>
    </div>


    <h4>Colorize the datepicker itself</h4>

	<p>There are numerous props to choose the colors of the datepicker itself. An example tells you more than a thousand words:</p>

    <div class="example">
        <div class="code">
            <pre><code class="html">
&lt;Datepicker
  format=&lbrace;dateFormat&rbrace;
  buttonBackgroundColor='#e20074'
  buttonTextColor='white'
  highlightColor='#e20074'
  dayBackgroundColor='#374b5e'
  dayTextColor='#fff'
  dayBorderColor='#5f75ce'
  dayHighlightedBackgroundColor='#d93856'
  dayHighlightedTextColor='#fff'
  backgroundColor='#2a3048'
  textColor='#fff'
/&gt;
            </code></pre>
        </div>

        <div class="live">
            <Datepicker
                format={dateFormat}
                buttonBackgroundColor='#e20074'
                buttonTextColor='white'
                highlightColor='#e20074'
                dayBackgroundColor='#374b5e'
                dayTextColor='#fff'
                dayBorderColor='#5f75ce'
                dayHighlightedBackgroundColor='#d93856'
                dayHighlightedTextColor='#fff'
                backgroundColor='#2a3048'
                textColor='#fff'
            />
        </div>
    </div>







    <h2>Usage (functionality)</h2>

    <h4>Date range</h4>

    <p>You can confine the date selection range with the <b>start</b> and <b>end</b> properties:</p>

	<div class='text-center'>
		<Datepicker format={dateFormat} start={threeDaysInPast} end={inThirtyDays} selectableCallback={noWeekendsSelectableCallback} />
	</div>

	<p class='note'>Note: The calendar will only generate dates up until the end date, so it is recommended to set this value to whatever is useful for you.</p>





    <h4>Customize which dates are valid</h4>

	<p>You can also provide a `selectableCallback` prop which can be used to mark individual days between `start` and `end` as selectable.  This callback should accept a single date as an argument and return true (if selectable) or false (if unavailable).</p>

	<div class='text-center'>
		<Datepicker format={dateFormat} start={tomorrow} end={inThirtyDays} selectableCallback={noWeekendsSelectableCallback} />
	</div>




    <h4>Event: dateSelected</h4>

	<p>You can bind to the `dateSelected` event, which has a data property `date`:</p>

	<div class='text-center'>
		<Datepicker format={dateFormat} on:dateSelected={e => logChoice(e.detail.date)} />
	</div>




    <h2>Localization (a.k.a l10n)</h2>

    <h4>Custom day and months name</h4>

    <p>
        Customize the names of the days with the <b>daysOfWeek</b> prop, and
        customize the names of the months with the <b>monthsOfYear</b> prop.
    </p>

    <div class="example">
        <div class="code">
            <pre><code class="html">
&lt;script&gt;
  let dateFormat = "#&lbrace;l&rbrace;, #&lbrace;F&rbrace; #&lbrace;j&rbrace;, #&lbrace;Y&rbrace;";
  const spanishDaysOfWeek = [
    [ 'Domingo', 'Dom' ],
    [ 'Lunes', 'Lun' ],
    [ 'Martes', 'Mar' ],
    [ 'Miércoles', 'Mié' ],
    [ 'Jueves', 'Jue' ],
    [ 'Viernes', 'Vie' ],
    [ 'Sábado', 'Sáb' ],
  ];
  const spanishMonthsOfYear = [
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
&lt;/script&gt;

&lt;Datepicker
  daysOfWeek=&lbrace;spanishDaysOfWeek&rbrace;
  monthsOfYear=&lbrace;spanishMonthsOfYear&rbrace;
  format=&lbrace;dateFormat&rbrace;
/&gt;
            </code></pre>
        </div>
        <div class="live">
            <Datepicker
              daysOfWeek={spanishDaysOfWeek}
              monthsOfYear={spanishMonthsOfYear}
              format={dateFormat}
            />
        </div>
    </div>


    <h4>Setting which day is the first day of the week</h4>

    <p>Not every country starts their weeks on Sundays. Use the <b>weekStart</b> prop to control which day of the week is considered the first. Sunday=0, Monday=1, ... Saturday=6</p>

    <div class="example">
        <div class="code">
            <pre><code class="html">
&lt;Datepicker weekStart=&lbrace;1&rbrace; format=&lbrace;dateFormat&rbrace; /&gt;
            </code></pre>
        </div>
        <div class="live">
            <Datepicker weekStart={1} format={dateFormat} />
        </div>
    </div>


    <h2>Changes from upstream</h2>

    <ul>
        <li>Changing the colors of the color picker (not just the button)</li>
    </ul>
</div>

<!--
    TODO usage without Svelte - where do I put it?

	<h4>Without Svelte HTML:</h4>
	<pre><code class='html'>
&lt;div class='button-container'&gt;
  &lt;button id='test'&gt;My Custom Button&lt;/button&gt;
&lt;/div&gt;
	</code></pre>

	<h4>Without Svelte JS:</h4>
	<pre><code class='js'>
var trigger = document.getElementById('test');
var cal = new SvelteCalendar(&#123;
  target: document.querySelector('.button-container'),
  anchor: trigger,
  props: &#123;
    trigger: trigger
  }
});
	</code></pre>
-->

<style>
    pre > code {
      font-size: 14px;
    }

	h1 {
      font-size: 54px;
      text-align: center;
      margin: 0;
      margin-top: 12px;
      /*margin: 100px 0;*/
	}
	.container {
      /*background-color: #d9dadf;*/
	  padding: 16px;
      padding-top: 0;
	  max-width: 100%;
	  width: 1200px;
	  margin: 0 auto;
	}
	.custom-button {
	  display: inline-block;
	  background: rgb(0, 120, 255);
	  color: #eee;
	  border: 1px solid rgb(0, 100, 255);
	  text-align: center;
	  padding: 15px 30px;
	  cursor: pointer;
	}
	.text-center {
	  text-align: center;
	}
	.note {
		color: tomato;
	}

    blockquote {
      margin: 0 auto;
	  width: 1200px;
      padding: 12px;
      background-color: #dfbdad;
      border-radius: 6px;
    }

    .example {
        border: 1px solid #999;
        border-radius: 2px;
        display: flex;
    }

    .example > div {
        width: 100%;
    }

    .example > .live {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ced5dd;
    }

    .example > .code {
        background-color: #474949;
    }
</style>
