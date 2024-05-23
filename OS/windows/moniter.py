import pyautogui
from screeninfo import get_monitors
import time

# Get information about the monitors
monitors = get_monitors()
main_monitor = monitors[0]
second_monitor = monitors[1]

# Define the main and secondary monitor regions
main_region = (main_monitor.x, main_monitor.y, main_monitor.width, main_monitor.height)
second_region = (second_monitor.x, second_monitor.y, second_monitor.width, second_monitor.height)

def move_cursor_bottom_to_top():
    while True:
        x, y = pyautogui.position()
        # Check if cursor is at the bottom edge of the main monitor
        if main_region[0] <= x <= main_region[0] + main_region[2] and y >= main_region[1] + main_region[3] - 1:
            # Move the cursor to the top of the secondary monitor
            new_x = x - main_region[0] + second_region[0]
            new_y = second_region[1]
            pyautogui.moveTo(new_x, new_y)
        time.sleep(0.01)  # Adjust the sleep time as needed

# Run the function
move_cursor_bottom_to_top()
