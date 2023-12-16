
from reasoner import StructuredReasoner

from colorama import Fore, Style
def printc(*args, color='reset', **kwargs):
    color_code = getattr(Fore, color.upper(), Fore.RESET)
    text = ' '.join(str(arg) for arg in args)
    print(color_code + text + Style.RESET_ALL, **kwargs)


if __name__ == '__main__':
    from typing import List

    THINK_FIRST = False
    system_prompt = (
        "You use your internal monologue to reason before responding to the user. "
        "You try to maximize how funny your response is."
    )
    reasoner = StructuredReasoner(system_prompt=system_prompt, model='gpt-3.5-turbo')

    while True:
        message = input("\nUser: ")
        if message == "quit":
            break
        
        reasoner.add_message('user', message)

        if THINK_FIRST:
            thought = reasoner.internal_monologue("I should brainstorm a list of funny ways to respond.")
            printc('\n' + thought, color='blue')
        else:
            reasoner.add_message('assistant', '[Internal Monologue]: I should brainstorm a list of funny ways to respond.')
        options = reasoner.extract_info("I came up with the following options:\n{options}", List[str])
        printc('\nOptions:\n- ' + '\n- '.join(options), color='yellow')

        if THINK_FIRST:
            thought = reasoner.internal_monologue("I need to choose the funniest response, I can only choose one. My options are:\n" + '\n'.join(options))
            printc('\n' + thought, color='blue')
        else:
            numbered_options = "\n".join([f"{i+1}. {option}" for i, option in enumerate(options)])
            reasoner.add_message('assistant', '[Internal Monologue]: I need to choose the funniest response. My options are:\n' + numbered_options)
        choice = reasoner.extract_info("I chose Option {choice_index}.", int)
        printc('\nChose response: ' + options[choice-1], color='yellow')