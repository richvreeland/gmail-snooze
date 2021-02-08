/* jshint esversion: 6 */

// user settings
var DEFAULT_HOUR = 6;
var DEFAULT_MIN  = 30;

// SHORTHAND SYNTAX
//
// 't' or '2' or 'd' = tomorrow. same as '1d'
// 'w' = next week
// 'm' = next month
// 'y' = next year
//
// ie. '11a' yields the next instance of 11am, which may be tomorrow.
//
// 'a'  : am
// 'p'  : pm
//
// ie. '3w' yields a time 3 weeks from now. for units greater than an hour, defaults to morning.
//
// '1m'  : in 1 minute
// '1h'  : in 1 hour
// '1d'  : in 1 day
// '1w'  : in 1 week
// '1mo' : in 1 month
// '1y'  : in 1 year

// some examples native to the API:
//
// 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
// 'jan 9 2019'
// 'next wed'

var chrono       = require('chrono-node');
var type         = 'native';
var present      = new Date();
var hour         = present.getHours();
var q	         = process.argv[2];

var weekdays     = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// shorthand for counting weekdays, ie. 3mon (3 mondays from now).
if (/[0-9]{1,}[a-z]{3}/i.test(q)) {

	type = 'counting weekdays';

	let q_num = Number(q.replace(/[a-z]{3}/i, ''));
	let q_day = q.replace(/[0-9]{1,}/i, ''); q_day = weekdays.findIndex(((x, i) => q_day == x));
	let today = present.getDay(); // yields int
	let days = 0;

	if (today % 7 == q_day) {

		days+=7;
	}

	while (today % 7 !== q_day) {

		today++;
		days++;
	}

	q_num--; days += (q_num * 7);
	var desiredDay = new Date(present); desiredDay.setDate(present.getDate() + days);
	q = desiredDay.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
}

// shorthand for next day, week, month, year. (t = tomorrow, w = next week, m = next month, y = next year).
if (/^[a-z]$/i.test(q)) {

	type = 'next unit';

	var tomorrow = new Date(present); tomorrow.setDate(present.getDate() + 1);
	var nextMonth = new Date(present); nextMonth.setMonth(present.getMonth() + 1);

	q = q
	.replace(/^y$/, 'next jan 1')
	.replace(/^m$/, nextMonth.toLocaleString('en-US', { month: 'short'} ))
	.replace(/^w$/, 'next mon')
	.replace(/^[t|2|d]$/, tomorrow.toLocaleString('en-US', { weekday: 'short' }));
}

// given 3a, 11pm, etc, always pick the next available instance of that time.
if (/[0-9]{1,}[a|p]/i.test(q)) {

	type = 'time';

	// requested hour
	var q_hr = Number(q.replace(/[^0-9]{1,}/i, ''));
	// convert to military time
	var q24 = /p/.test(q) ? q_hr + 12 : q_hr;
	// add next day language if we've already passed the requested hour today.
	q = q24 <= hour ? ("in 1 days at " + q) : q;
}

// 'd20' yields a random time in the next 1-12 months (approx)
q = /^d20$/.test(q) ? 'in ' + (86400 + Math.round(Math.random() * 475200)) + ' minutes' : q;

// if input is a number followed by a designated shorthand (ie. 72d), convert to 'in x units' format for API.
if (/(?<=[0-9]{1,})[y|mo|w|d|h|m]{1,}\b/i.test(q)) {

	type = '# of units';

	var shorthands = ['y', 'mo', 'w', 'd', 'h', 'm'];
	var longhands  = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'];
	var num        = q.replace(/[A-Z]{1,}/i, ' ');
	var abc        = q.replace(/[0-9]{1,}/i, '');

	for (var i = 0; i < 6; i++)
		abc = abc.replace(new RegExp('^' + shorthands[i] + '$', 'i'), longhands[i]);

	q = 'in ' + num + abc;
}

// refine results to have a custom default time, when time is unspecified by the user.
var defaultTime = new chrono.Refiner();
defaultTime.refine = function(text, results, opt) {

    results.forEach(function (result) {
        if (!result.start.isCertain('hour')) {

            result.start.assign('hour', DEFAULT_HOUR);
            result.start.assign('minute', DEFAULT_MIN);
        }
    });
    return results;
};

var custom = new chrono.Chrono();
custom.refiners.push(defaultTime);

var future = custom.parseDate(q, present, { forwardDate: true });

bugFixes: {

	// set 'future' to next occurring instance of weekday if weekday matches current weekday, this is a workaround.
	if (q.includes(present.toLocaleString('en-US', { weekday: 'short'}).toLowerCase())) {

		type = 'same weekday, push ahead one week';

		future.setDate(present.getDate() + 7);
	}

	// fix a bug where aug/sep/oct/nov/dec yield a date in the past (?)
	while (future < present)
		future.setFullYear(future.getFullYear() + 1);
}

//console.log('\ninput type: ' + type + '\nquery: ' + q + '\n');

var dateString = future.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
var timeString = future.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

console.log(dateString + "|" + timeString);