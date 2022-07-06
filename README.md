# Welcome to my Neflix Slider Clone

The aim for this project was to create a slider that behaves just as the Neflix sliders behave, from the users perspective.

### GSAP

The project required a deep dive into css transitions, which eventually led to the discovery of the Greensock Animation Platform, which allowed me to clean up my code whilst producing smoother transitions.

### API

The project was also an exercise in working with an external API (The Movie Data Base)

### Continuous Slider

I didn't write the functionality for the scrolling mechanism itself, but studied it closely to see how it works. here is a brief overview:

Modulus arithmetic is used to cycle through our model. We map that list to a theoretically infinite number of key props. Like a small finite cog on a cog with an infinite number of teeth! At first we do this as a segment of thirteen items, giving to each, a position. Subsequent segments (next and prev) overlap so we can see the new elements slide into view.
