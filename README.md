SnoozeGmail v1.11
by Rich Vreeland

# Setup #

- Add the Alfred workflow to Alfred, and the Keyboard Maestro macro to Keyboard Maestro.
- In order to use the ! command with IFTTT, you will need to create an IFTTT trigger that sends yourself mail and update the key in the Alfred workflow.
- In the Alfred workflow, you may need to update the macro ID for the Keyboard Maestro macro. You can find this ID by exporting the imported KM macro, and opening the XML.

to use :

- if on the inbox screen : select e-mail(s) first.
- invoke Alfred and type `z `

available syntax :

't' or '2' or 'd' = tomorrow. same as '1d'
'w' = next week
'm' = next month
'y' = next year

'11a' = next instance of 11am, which may be tomorrow

'3w' = 3 weeks from now. for units greater than an hour, defaults to morning.

'1m'  : in 1 minute
'1h'  : in 1 hour
'1d'  : in 1 day
'1w'  : in 1 week
'1mo' : in 1 month
'1y'  : in 1 year

'd20' : a random time within the next year.

some examples native to the API:

'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
'jan 9 2019'
'next wed'
