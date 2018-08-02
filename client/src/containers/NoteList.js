import * as React from 'react';
import NoteItem from '../components/NoteItem';

const notes = [{
  id: 1,
  title: 'Something',
  description: 'Something else',
}, {
  id: 2,
  title: 'Something',
  description: 'Something else',
}, {
  id: 3,
  title: 'Something',
  description: 'Something else',
}, {
  id: 4,
  title: 'Something',
  description: 'Something else',
}];

export default function NoteList() {
  return (
    <div>
      { notes.map(n => <NoteItem key={n.id} note={n} />) }
    </div>
  );
}
