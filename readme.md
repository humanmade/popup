# Popup Block

A lightweight, modern popup block for WordPress that displays any content as a modal dialog.

## Features

### Trigger Modes

-   **Click trigger** - Open popup from any link or button by setting the URL to `#your-popup-id`
-   **Exit intent** - Automatically show popup when user moves cursor to leave the page

### Display Styles

-   **Centered modal** - Default full-screen overlay with centered content
-   **Left sidebar** - Slide-in panel from the left edge
-   **Right sidebar** - Slide-in panel from the right edge

### Anchor Positioning

Position popups relative to their trigger button using CSS anchor positioning:

-   **Bottom** / Bottom Start / Bottom End
-   **Top** / Top Start / Top End
-   **Left** / Left Start / Left End
-   **Right** / Right Start / Right End

Anchored popups automatically reposition when they would overflow the viewport.

### Styling Options

-   Customizable backdrop opacity (0-100%)
-   Backdrop background color support
-   Backdrop background image support
-   Full layout controls for popup content width

### Accessibility

-   Built on native HTML `<dialog>` element
-   Keyboard accessible (Escape to close)
-   Click backdrop to close
-   Add close buttons with `#close` URL

## Usage

1. Add a Popup Block to your page
2. Set an anchor/ID for the popup (e.g., `my-popup`)
3. Add your content inside the popup
4. Create a button or link with URL `#my-popup` to trigger it

### Exit Intent Popup

1. Add a Popup Block and set trigger to "On exit intent"
2. Configure cookie expiration (days before showing again)
3. The popup will appear when users move to leave the page

### Anchored Popup

1. Add a Popup Block with click trigger
2. Enable "Use Anchoring" in block settings
3. Select anchor position (bottom, top, left, right, etc.)
4. The popup will appear attached to the trigger button

## Requirements

-   WordPress 6.1+
-   PHP 7.0+

## License

GPL-2.0-or-later
