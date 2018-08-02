import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

type Props = {
  classes: Object,
  children: React.Component
};

const styles = theme => ({
  wrapper: {
    flexGrow: 1,
    flexShrink: 0,
  },

  container: {
    overflow: 'auto',
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
    color: theme.primary.contrastText,
    backgroundColor: theme.primary.main,
  },
});

function Layout({ classes, children }: Props) {
  return (
    <div className={classes.wrapper}>
      <Grid
        container
        spacing={8}
        justify="center"
        alignItems="center"
      >
        <Grid
          item
          lg={8}
          sm={10}
          xs={12}
        >
          <Paper className={classes.container}>
            { children }
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Layout);
