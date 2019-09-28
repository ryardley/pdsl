exit_unless_say_yes() {
  read -p "$1" YN
  if [[ "$YN" != "y" ]] && [[ "$YN" != "Y" ]]; then
    if [[ -n "$2" ]]; then 
      echo $2
    fi 
    exit 0;
  fi
}