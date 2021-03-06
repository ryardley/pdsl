exit_unless_say_yes() {
  read -p "$1" yn
  if [[ "$yn" != "y" ]] && [[ "$yn" != "Y" ]]; then
    if [[ -n "$2" ]]; then 
      echo $2
    fi 
    exit 0;
  fi
}

exit_if_empty() {
  if [[ -z "$1" ]]; then
    if [[ -n "$2" ]]; then
      echo "$2"
    fi
    exit 1
  fi 
}