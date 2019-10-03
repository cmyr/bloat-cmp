# Bloat check?

This action is some initial hacking to try and do binary size comparisons on
PRs.

## Inputs

### `base_sizes`

path to the baseline file, each line of which is the name of a target and a byte count.

### `new_sizes`

path to the new sizes file, each line of which is the name of a target and a byte count.

