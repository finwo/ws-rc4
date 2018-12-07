#!/usr/bin/env bash

# based on:
#   https://jblablog.wordpress.com/2012/09/20/a-basic-templating-engine-in-bash/
#   https://serverfault.com/a/699377
#   https://stackoverflow.com/a/6318901

PROG=$(basename $0)

# from: https://stackoverflow.com/a/6318901
ini_read() {
  ini="$(<$1)"                               # read the file
  ini="${ini//[/\[}"                         # escape [
  ini="${ini//]/\]}"                         # escape ]
  IFS=$'\n' && ini=( ${ini} )                # convert to line-array
  ini=( ${ini[*]//;*/} )                     # remove comments with ;
  ini=( ${ini[*]/\    =/=} )                 # remove tabs before =
  ini=( ${ini[*]/=\   /=} )                  # remove tabs be =
  ini=( ${ini[*]/\ =\ /=} )                  # remove anything with a space around =
  ini=( ${ini[*]/#\\[/\}$'\n'ini.section.} ) # set section prefix
  ini=( ${ini[*]/%\\]/ \(} )                 # convert text2function (1)
  ini=( ${ini[*]/=/=\( } )                   # convert item to array
  ini=( ${ini[*]/%/ \)} )                    # close array parenthesis
  ini=( ${ini[*]/%\\ \)/ \\} )               # the multiline trick
  ini=( ${ini[*]/%\( \)/\(\) \{} )           # convert text2function (2)
  ini=( ${ini[*]/%\} \)/\}} )                # remove extra parenthesis
  ini[0]=""                                  # remove first element
  ini[${#ini[*]} + 1]='}'                    # add the last brace
  eval "$(echo "${ini[*]}")"                 # eval the result
}
ini_write () {
    IFS=' '$'\n'
    fun="$(declare -F)"
    fun="${fun//declare -f/}"
    for f in $fun; do
        [ "${f#ini.section}" == "${f}" ] && continue
        item="$(declare -f ${f})"
        item="${item##*\{}"
        item="${item%\}}"
        item="${item//=*;/}"
        vars="${item//=*/}"
        eval $f
        echo "[${f#ini.section.}]"
        for var in $vars; do
            echo $var=\"${!var}\"
        done
    done
}

usage() {
  echo "${PROG} <template-file> [<config-file>]"
}

merge_template () {
    # Merge template files and do variable substitution
    #
    # $1: Template file
    #
    # Supported directives:
    #   #include filename : Include filename and process it.
    #   ${variable}       : substituted by the value of the variable.
    #
    [ -z "$1" ] && return
    set -f
    while IFS='' read -r line; do
        if [[ "$line" =~ \#include\ (.*) ]]; then
            $FUNCNAME $(dirname $1)/${BASH_REMATCH[1]}
        else
            while [[ "$line" =~ (\$\{[a-zA-Z_][a-zA-Z_0-9]*\}) ]] ; do
                LHS="${BASH_REMATCH[1]}"
                RHS="$(eval echo "\"$LHS\"")"
                line="${line//$LHS/$RHS}"
            done
            printf "%s\n" "$line"
        fi
    done<$1
    set +f
}

case $# in
  1) merge_template "$1";;
  2) ini_read "$2"; ini.section.template; merge_template "$1";;
  *) usage; exit 0;;
esac
