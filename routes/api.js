'use strict';

const { pool } = require('../db.js');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async function(req, res) {
      try {
        const board = req.params.board;
        const { text, delete_password } = req.body;
        
        if (!text || !delete_password) {
          return res.status(400).json({ error: 'text and delete_password are required' });
        }
        
        const result = await pool.query(
          `INSERT INTO threads (board, text, delete_password) 
           VALUES ($1, $2, $3) 
           RETURNING _id, text, created_on, bumped_on, reported`,
          [board, text, delete_password]
        );
        
        res.redirect('/b/' + board + '/');
      } catch (err) {
        console.error('Error creating thread:', err);
        res.status(500).json({ error: 'Error creating thread' });
      }
    })
    
    .get(async function(req, res) {
      try {
        const board = req.params.board;
        
        const threadsResult = await pool.query(
          `SELECT _id, text, created_on, bumped_on 
           FROM threads 
           WHERE board = $1 
           ORDER BY bumped_on DESC 
           LIMIT 10`,
          [board]
        );
        
        const threads = await Promise.all(threadsResult.rows.map(async (thread) => {
          const repliesResult = await pool.query(
            `SELECT _id, text, created_on 
             FROM replies 
             WHERE thread_id = $1 
             ORDER BY created_on DESC 
             LIMIT 3`,
            [thread._id]
          );
          
          const countResult = await pool.query(
            `SELECT COUNT(*) as count FROM replies WHERE thread_id = $1`,
            [thread._id]
          );
          
          return {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: repliesResult.rows.reverse(),
            replycount: parseInt(countResult.rows[0].count)
          };
        }));
        
        res.json(threads);
      } catch (err) {
        console.error('Error getting threads:', err);
        res.status(500).json({ error: 'Error getting threads' });
      }
    })
    
    .put(async function(req, res) {
      try {
        const { thread_id, report_id } = req.body;
        const id = thread_id || report_id;
        
        if (!id) {
          return res.status(400).send('thread_id is required');
        }
        
        await pool.query(
          `UPDATE threads SET reported = true WHERE _id = $1`,
          [id]
        );
        
        res.send('reported');
      } catch (err) {
        console.error('Error reporting thread:', err);
        res.status(500).send('error');
      }
    })
    
    .delete(async function(req, res) {
      try {
        const { thread_id, delete_password } = req.body;
        
        if (!thread_id || !delete_password) {
          return res.status(400).send('thread_id and delete_password are required');
        }
        
        const result = await pool.query(
          `SELECT delete_password FROM threads WHERE _id = $1`,
          [thread_id]
        );
        
        if (result.rows.length === 0) {
          return res.send('incorrect password');
        }
        
        if (result.rows[0].delete_password !== delete_password) {
          return res.send('incorrect password');
        }
        
        await pool.query(`DELETE FROM threads WHERE _id = $1`, [thread_id]);
        
        res.send('success');
      } catch (err) {
        console.error('Error deleting thread:', err);
        res.status(500).send('error');
      }
    });
    
  app.route('/api/replies/:board')
    .post(async function(req, res) {
      try {
        const board = req.params.board;
        const { text, delete_password, thread_id } = req.body;
        
        if (!text || !delete_password || !thread_id) {
          return res.status(400).json({ error: 'text, delete_password, and thread_id are required' });
        }
        
        const threadCheck = await pool.query(
          `SELECT _id FROM threads WHERE _id = $1`,
          [thread_id]
        );
        
        if (threadCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Thread not found' });
        }
        
        const result = await pool.query(
          `INSERT INTO replies (thread_id, text, delete_password) 
           VALUES ($1, $2, $3) 
           RETURNING _id, text, created_on`,
          [thread_id, text, delete_password]
        );
        
        await pool.query(
          `UPDATE threads SET bumped_on = $1 WHERE _id = $2`,
          [result.rows[0].created_on, thread_id]
        );
        
        res.redirect('/b/' + board + '/' + thread_id);
      } catch (err) {
        console.error('Error creating reply:', err);
        res.status(500).json({ error: 'Error creating reply' });
      }
    })
    
    .get(async function(req, res) {
      try {
        const { thread_id } = req.query;
        
        if (!thread_id) {
          return res.status(400).json({ error: 'thread_id is required' });
        }
        
        const threadResult = await pool.query(
          `SELECT _id, text, created_on, bumped_on 
           FROM threads 
           WHERE _id = $1`,
          [thread_id]
        );
        
        if (threadResult.rows.length === 0) {
          return res.status(404).json({ error: 'Thread not found' });
        }
        
        const thread = threadResult.rows[0];
        
        const repliesResult = await pool.query(
          `SELECT _id, text, created_on 
           FROM replies 
           WHERE thread_id = $1 
           ORDER BY created_on ASC`,
          [thread_id]
        );
        
        thread.replies = repliesResult.rows;
        
        res.json(thread);
      } catch (err) {
        console.error('Error getting replies:', err);
        res.status(500).json({ error: 'Error getting replies' });
      }
    })
    
    .put(async function(req, res) {
      try {
        const { thread_id, reply_id } = req.body;
        
        if (!thread_id || !reply_id) {
          return res.status(400).send('thread_id and reply_id are required');
        }
        
        await pool.query(
          `UPDATE replies SET reported = true WHERE _id = $1 AND thread_id = $2`,
          [reply_id, thread_id]
        );
        
        res.send('reported');
      } catch (err) {
        console.error('Error reporting reply:', err);
        res.status(500).send('error');
      }
    })
    
    .delete(async function(req, res) {
      try {
        const { thread_id, reply_id, delete_password } = req.body;
        
        if (!thread_id || !reply_id || !delete_password) {
          return res.status(400).send('thread_id, reply_id, and delete_password are required');
        }
        
        const result = await pool.query(
          `SELECT delete_password FROM replies WHERE _id = $1 AND thread_id = $2`,
          [reply_id, thread_id]
        );
        
        if (result.rows.length === 0) {
          return res.send('incorrect password');
        }
        
        if (result.rows[0].delete_password !== delete_password) {
          return res.send('incorrect password');
        }
        
        await pool.query(
          `UPDATE replies SET text = '[deleted]' WHERE _id = $1`,
          [reply_id]
        );
        
        res.send('success');
      } catch (err) {
        console.error('Error deleting reply:', err);
        res.status(500).send('error');
      }
    });

};
