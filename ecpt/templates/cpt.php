<?php
/**
 * <%= cptname %>
 *
 * @since NEXT
 * @package <%= pluginname %>
 */

<% if ( ! composer ) { %>require_once dirname(__FILE__) . '/../vendor/extended-cpts/extended-cpts.php';<% } %>

/**
 * <%= cptname %> post type class.
 *
 * @see https://github.com/johnbillion/extended-cpts
 * @since NEXT
 */
class <%= classname %> {
	/**
	 * Parent plugin class
	 *
	 * @var class
	 * @since  NEXT
	 */
	protected $plugin = null;

    private $slug = '<%= ecptslug %>';
    private $plural_name = '<%= ecptplural %>';
    private $singular_name = '<%= ecptsingular %>';

	/**
	 * Constructor
	 *
	 * @since  NEXT
	 * @param  object $plugin Main plugin object.
	 * @return void
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		$this->hooks();
	}

	/**
	 * Initiate our hooks
	 *
	 * @since  NEXT
	 * @return void
	 */
	public function hooks() {
		add_action( 'init', array( $this, 'register_cpt' ) );
	}

	/**
	 * Register the custom post type
	 *
	 * @since  NEXT
	 * @return void
	 */
	public function register_cpt() {
    	
    	$args = array(

            'supports' => array( 'title', 'author', 'custom-fields' ),
            'public' => false,
            'publicly_queryable' => true,
            'exclude_from_search' => true,
            'show_ui' => true,
            'menu_icon' => 'dashicons-admin-network',

            # Add some custom columns to the admin screen:
            'admin_cols' => array(
                'provider' => array(
                    'title'       => 'Provider',
                    'meta_key'    => 'provider'
                )
            ),

            # Add a dropdown filter to the admin screen:
            'admin_filters' => array(
                'provider' => array(
                    'meta_key' => 'provider'
                )
            )

        );

        register_extended_post_type( $this->slug, $args, array(
            'singular' => $this->singular_name,
            'plural'   => $this->plural_name,
            'slug'     => $this->slug
        ) );
	}
}
