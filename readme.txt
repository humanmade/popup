=== Popup Block ===
Contributors:      humanmade
Tags:              block, popup, modal, dialog, exit intent
Tested up to:      6.8.2
Stable tag:        0.3.0
Requires at least: 6.1
Requires PHP:      7.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A lightweight, modern popup block for WordPress that displays any content as a modal dialog.

== Description ==

Built using modern web standards with the native HTML `<dialog>` element, this block lets you create beautiful popups with any content. Use it for announcements, forms, galleries, or any other UI pattern.

= Features =

**Trigger Modes**

* Click trigger - Open popup from any link or button
* Exit intent - Show popup when user moves to leave the page

**Display Styles**

* Centered modal - Default full-screen overlay with centered content
* Left sidebar - Slide-in panel from the left edge
* Right sidebar - Slide-in panel from the right edge

**Anchor Positioning**

Position popups relative to their trigger button:

* Bottom / Bottom Start / Bottom End
* Top / Top Start / Top End
* Left / Left Start / Left End
* Right / Right Start / Right End

**Styling Options**

* Customizable backdrop opacity (0-100%)
* Backdrop background color
* Backdrop background image
* Full layout controls for content width

**Accessibility**

* Built on native HTML dialog element
* Keyboard accessible (Escape to close)
* Click backdrop to close

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/popup-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add a Popup Block to any page or post.

== Usage ==

= Basic Popup =

1. Add a Popup Block to your page
2. Set an anchor/ID for the popup (e.g., `my-popup`)
3. Add your content inside the popup
4. Create a button or link with URL `#my-popup` to trigger it

= Exit Intent Popup =

1. Add a Popup Block and set trigger to "On exit intent"
2. Configure cookie expiration (days before showing again)
3. The popup will appear when users move to leave the page

= Anchored Popup =

1. Add a Popup Block with click trigger
2. Enable "Use Anchoring" in block settings
3. Select anchor position (bottom, top, left, right, etc.)
4. The popup will appear attached to the trigger button

= Close Buttons =

Add a close button inside your popup by creating a link or button with the URL `#close`.

== Frequently Asked Questions ==

= How do I close the popup? =

Popups can be closed by:
* Clicking the backdrop (area outside the popup)
* Pressing the Escape key
* Clicking any link or button with URL `#close`

= Does this work with the block editor? =

Yes! This is a native WordPress block that works in the block editor (Gutenberg).

= What browsers support anchor positioning? =

CSS anchor positioning is supported in modern browsers (Chrome 125+, Edge 125+). In unsupported browsers, anchored popups will fall back to centered modal display.

== Screenshots ==

== Changelog ==

= 0.3.0 =
* Added anchor positioning to attach popups to trigger buttons
* Added 12 anchor position options (top, bottom, left, right with start/end variants)
* Automatic repositioning when popup would overflow viewport

= 0.2.0 =
* Added left/right sidebar display styles
* Added backdrop color and opacity support
* Added backdrop background image support

= 0.1.0 =
* Initial release
