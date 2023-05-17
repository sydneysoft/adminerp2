function iconState (state) {
  if (!state.id) { return state.text; }
      let $state = $(
        '<span><i class="' +  state.element.value.toLowerCase() + '"> </i> ' + 
    state.text +     '</span>'
  );
  return $state;
};
