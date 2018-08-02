import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

type Prop = {
  note: Object,
  classes: Object,
};

const styles = () => ({
  checkWrapper: {
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noteItem: {
    padding: 5,
  },
});

function NoteItem({ note, classes }: Prop) {
  console.log(note, classes);

  return (
    <Grid
      item
      xs={12}
    >
      <Grid
        container
        alignItems="center"
        className={classes.noteItem}
      >
        <Grid
          item
          className={classes.checkWrapper}
        >
          [ ]
        </Grid>

        <Grid
          item
          xs
        >
          <Grid
            container
          >
            <Grid
              item
              xs={12}
            >
              {note.title}
            </Grid>
            <Grid
              item
              xs={12}
            >
              {note.description}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(NoteItem);
