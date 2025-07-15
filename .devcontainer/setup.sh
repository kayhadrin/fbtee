###
# Setup script for the development container
###

echo "Setting up pnpm global CLI"
npm install -g pnpm@latest-10
pnpm completion bash > ~/pnpm_completion.sh
chmod +x ~/pnpm_completion.sh
echo ". ~/pnpm_completion.sh" >> ~/.bashrc

# TODO: setup more git config based on https://github.com/kayhadrin/git-utils
echo "Setting up common bash aliases"
cat << EOM >> ~/.bash_aliases
alias ll='ls -alh'

alias g='git'
alias gb='git branch'
alias gs='git status'
alias gc='git commit'

# git log graph showing commit hash, date and message
alias gl='git log --oneline --graph --decorate'
# git log graph showing hash, time, author and commit message
alias gla='git log --graph --pretty=format:"%C(yellow)%h%Creset %Cgreen(%ah) %C(bold blue)[%an]%Creset %C(cyan)%d%Creset %s" --date=short'
EOM