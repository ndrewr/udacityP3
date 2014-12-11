frontend-nanodegree-arcade-game
===============================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.

TODO::Current features to implement:
- new graphics set
- expanded play field
- 2 enemy types
- stage win condition (ex open a gate)

Level Ideas:

- Level 1 - basic frogger, enemies come in from left move to right, different speeds and staggers

- Level 2 - frogger, but with enemies from both left and right

- Level 3 - Collect keys scattered around map to unlock gate and advance

- Level 4 - Player must collect weapon from starting side, make way to strike 'boss', then go back and collect another weapon and repeat until dead

- implement 'Level Object' that contains level tile maps and different rule flags. A selector for level rules can be set in a seperate function that decides victory conditions....this is separate from 'collision' function which determines if player gets killed

- for level objects like keys or swords, implement 'accessory' object that takes a image object and that level objects can lay out accordingly. Collision function may need to be altered to check if player moves to accessory square...if yes, player "collects" accessory. NOTE: boss can actually also be considered accessory if he is just stationary waiting to be killed

- A Timer that carries over level-to-level and logs hi-scores?
