<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let month;
  export let year;
  export let start;
  export let end;
  export let canIncrementMonth;
  export let canDecrementMonth;
  export let monthsOfYear;

  // overviewState: if we're looking at
  // month-view (1), year-view (2) or multi-year-view (3)
  let overviewState = 1;
  let availableMonths;
  let availableYears;

  $: {
    let isOnLowerBoundary = start.getFullYear() === year;
    let isOnUpperBoundary = end.getFullYear() === year;
    availableMonths = monthsOfYear.map((m, i) => ({
        name: m[0],
        abbrev: m[1],
        selectable:
          (!isOnLowerBoundary && !isOnUpperBoundary)
          || (
            (!isOnLowerBoundary || i >= start.getMonth())
            && (!isOnUpperBoundary || i <= end.getMonth())
          )
      }));
  }

  $: {
    let baseYear = year - year % 12;
    availableYears = Array(12).fill(baseYear).map((yr, i) => {
      return {
        year: yr + i,
        // TODO change: they should not all be selectable
        selectable: true
      };
    });
  }
  
  function headingLabelClick() {
		/* eslint-disable-next-line */
		switch (overviewState) {
			case 1: overviewState = 2; break;
			case 2: overviewState = 3; break;
			case 3: overviewState = 3; break;
		}
  }

  function monthSelected(event, { m, i }) {
    event.stopPropagation();
    if (!m.selectable) return;
    dispatch('monthSelected', i);
    overviewState = 1;
  }

  function yearSelected(ev, year) {
    ev.stopPropagation();
    if (!year.selectable) return;    
    dispatch('yearSelected', year.year);
    overviewState = 2;
  }

  /* eslint-disable-next-line */
  function _go(forward = true, overviewState) {
		// this formula makes true=1 and false=-1
		/* eslint-disable-next-line */
		const sign = ~forward + (+forward) * 3;
		// const incr = sign * ((overviewState - 1) * 12);
		// TODO this is not correct

		// For what following line? If disable it -> works fine
		//  const incr = sign * overviewState + sign * 12 ** (overviewState - 1);

    if (overviewState == 3) year += sign * 12
		else{
      dispatch('incrementMonth', sign);
    }
  }

  function goBack() { _go(false, overviewState); }
  function goForward() { _go(true, overviewState); }

  function determineHeadingLabel(overviewState) {
    if (overviewState === 1) {
      return `${monthsOfYear[month][0]} ${year}`;
    } if (overviewState === 2) {
      return year;
    } if (overviewState === 3) {
      const from = availableYears[0].year;
      const to = availableYears[availableYears.length - 1].year;
      return `${from} - ${to}`;
    }
  }
  $: headingLabel = determineHeadingLabel(overviewState, month, year);
</script>

<div class="title">
  <div class="heading-section">
    <div class="control" 
      class:enabled={canDecrementMonth}
      on:click={goBack}>
      <i class="arrow left"></i>
    </div>
    <div class="label" on:click={headingLabelClick}>
      {headingLabel}
    </div> 
    <div class="control"
      class:enabled={canIncrementMonth}
      on:click={goForward}>
      <i class="arrow right"></i>
    </div>
  </div>
  <div class="month-selector" class:open={overviewState !== 1}>
    {#if overviewState === 2}
      {#each availableMonths as monthDefinition, index}
        <div 
          class="month-selector--month" 
          class:selected={index === month}
          class:selectable={monthDefinition.selectable}
          on:click={e => monthSelected(e, { m: monthDefinition, i: index })}
        >
          <span>{monthDefinition.abbrev}</span>
        </div>
      {/each}
    {:else if overviewState === 3}
      {#each availableYears as yearDefinition}
        <div
          class="month-selector--month"
          class:selected={yearDefinition.year === year}
          class:selectable={yearDefinition.selectable}
          on:click={e => yearSelected(e, yearDefinition)}
        >
          <span>{yearDefinition.year}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .heading-section { 
    font-size: 20px;
    padding: 24px 15px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }
  .label { 
    cursor: pointer;
  }
  .month-selector { 
    position: absolute;
    top: 75px; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    background-color: var(--background-color);
    transition: all 300ms; 
    transform: scale(1.2); 
    opacity: 0; 
    visibility: hidden;
    z-index: 1;
    text-align: center;
  }
  .month-selector.open { 
    transform: scale(1); 
    visibility: visible;
    opacity: 1;
  }
  .month-selector--month { 
    width: 31.333%; 
    margin: .5%; 
    height: 23%;
    display: inline-block;
    border: 1px solid var(--day-border-color);
    background-color: var(--day-background-color);
    opacity: 0.2;
  }
  .month-selector--month.selectable { 
    opacity: 1; 
  }
  .month-selector--month.selectable:hover { 
    cursor: pointer;
    box-shadow: 0px 0px 3px rgba(0,0,0,0.15);
  }
  .month-selector--month.selected { 
    background: var(--highlight-color);
    color: #fff;
  }
  .month-selector--month:before { 
    content: ' ';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  .month-selector--month span { 
    vertical-align: middle; 
    display: inline-block;
  }

  .control { 
    padding: 0 8px;
    opacity: 0.2;
    transform: translateY(3px);
  }

  .control.enabled { 
    opacity: 1; 
    cursor: pointer;
  }

  .arrow {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-style: solid;
    border-color: #a9a9a9;
    border-width: 0;
    border-bottom-width: 2px;
    border-right-width: 2px;
  }

  .arrow.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .arrow.left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
  }

</style>
