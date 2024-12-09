const moment = require('moment');
const blogModel = require('../models/blogModel');

const add_blog = async (req, res) => {
    
    try {
        const { blogTitle } = req.body

        if (!blogTitle) {
            return res.json({
                message: 'Blog title is required',
                error: true,
                success: false
            });
        }

        const lowerCaseBlogTitle = blogTitle.trim().toLowerCase();
        const slug = lowerCaseBlogTitle.split(' ').join('-');
        

        const uploadBlog = new blogModel({
            blogTitle: blogTitle.trim(),
            slug: slug,
            date: moment().format('LL'),
            ...req.body,
        }
        )
        const saveBlog = await uploadBlog.save();

        res.status(201).json({
            message: "Blog upload successfull",
            error: false,
            success: true,
            data: saveBlog
        });
    } catch (error) {
        console.error('Error parsing form:', error);
        res.status(400).json({
            message: 'Error parsing form',
            error: true,
            success: false
        });
    }
};

const get_blog = async (req, res) => {
    try {
        const allBlog = await blogModel.find().sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All Blogs",
            success: true,
            error: false,
            data: allBlog
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
};

const update_blog_status = async (req, res) => {
    const { blog_id } = req.params
    const { status } = req.body

    const updatedStatus = await blogModel.findByIdAndUpdate(blog_id, { status }, { new: true })
    return res.status(200).json({ message: 'Blog status update success', updatedStatus })

};

const delete_Blog = async (req, res) => {
    console.log("calling...");
    
    const { blog_id } = req.params;

    try {
        const blog = await blogModel.findById(blog_id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await blogModel.findByIdAndDelete(blog_id);

        return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error("Error deleting Blog:", error);
        return res.status(500).json({ message: 'Internal blog error' });
    }
};

const get_categorywise_blog = async (req, res) => {
    
    try {
        const { blog_id } = req.params

        const blog = await blogModel.findById(blog_id);
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found',
                error: true,
                success: false
            });
        }
        res.status(201).json({
            message: "All Blogs",
            error: false,
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

const update_categorywise_blog = async (req, res) => {
    console.log("calling...");
  
    try {
      const { blogTitle, blogImage, description } = req.body;
  
      // Check for required fields
      if (!blogTitle || !blogImage || !description) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      // Safely generate the slug from blogTitle
      const slug = blogTitle?.trim()?.toLowerCase()?.split(' ')?.join('-');
  
      // Update the blog
      const blog = await blogModel.findByIdAndUpdate(
        req.params.blog_id,
        {
          blogTitle,
          slug, // Use the generated slug
          blogImage,
          description,
        },
        { new: true }
      );
  
      // If the blog is not found
      if (!blog) {
        return res.status(404).json({
          success: false,
          error: true,
          message: 'Blog not found',
        });
      }
  
      // Respond with success
      res.json({
        success: true,
        error: false,
        message: 'Blog updated successfully',
        blog,
      });
    } catch (error) {
      console.error("Error:", error.message); // Log the error for debugging
  
      // Respond with a 500 error if something goes wrong
      res.status(500).json({
        success: false,
        message: "Internal server error: " + error.message,
      });
    }
  };
  
  
  



// For website
const get_blog_for_website = async (req, res) => {
    try {
        const allBlog = await blogModel.find().sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All Blog",
            success: true,
            error: false,
            data: allBlog
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const get_single_blog_for_website = async (req, res) => {
    
    const { slug } = req.query;

    try {
        const singleBlog = await blogModel.findOne({ slug: slug });

        if (!singleBlog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false,
                error: true,
            });
        }
        

        return res.status(200).json({
            message: "Get Blog",
            success: true,
            error: false,
            data: singleBlog
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};





module.exports = {
    add_blog,
    get_blog,
    update_blog_status,
    delete_Blog,
    get_categorywise_blog,
    update_categorywise_blog,
    get_blog_for_website,
    get_single_blog_for_website
};
