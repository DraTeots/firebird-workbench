# Adjusting the code to include color names on the visualization
fig, ax = plt.subplots(figsize=(10, 8))

# Height of each color strip
strip_height = 1

for i, color in enumerate(colors):
    # Plotting each color strip
    ax.add_patch(plt.Rectangle((0, i), 10, strip_height, color=color))
    # Adding hex code as text
    ax.text(0.5, i + 0.5, f"{color.upper()}",
            verticalalignment='center', horizontalalignment='left',
            color='w' if i != 10 else 'black', fontsize=10, weight='bold')
    # Adding color name in snake_case
    color_names = [
        "electric_blue",
        "radiant_red",
        "emerald_green",
        "bright_yellow",
        "vivid_violet",
        "hot_pink",
        "tangerine",
        "sky_blue",
        "lime_green",
        "magenta",
        "cyan",
        "amber"
    ]
    ax.text(5, i + 0.5, f"{color_names[i]}",
            verticalalignment='center', horizontalalignment='center',
            color='w' if i != 10 else 'black', fontsize=10, weight='bold')

# Adjusting the plot
ax.set_xlim(0, 10)
ax.set_ylim(0, len(colors))
plt.axis('off')
plt.tight_layout()

# Save the visualization with color names and hex codes
plt.savefig("/mnt/data/dynamic_contrast_palette_with_names.png", dpi=300, format="png")
plt.show()
