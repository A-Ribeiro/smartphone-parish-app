using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace editor_noticia
{
    public partial class Form1 : Form
    {

        noticiajson.NewsList _noticiajson = new noticiajson.NewsList();

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            _noticiajson = noticiajson.readFromFile("content/news.json");

            comboBox1.Items.Clear();
            foreach (noticiajson.News news in _noticiajson.news_list)
                comboBox1.Items.Add(news.news_title);

            tb_titulo_pagina.Text = "";
            tb_titulo_noticia.Text = "";
            tb_descricao_noticia.Text = "";
            tb_noticia.Text = "";

            if (_noticiajson.news_list.Count>0)
            {
                comboBox1.SelectedIndex = 0;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;
            } else
            {
                bt_new.Enabled = false;
                bt_remove.Enabled = false;
                bt_save.Enabled = true;
            }
            
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0) {
                noticiajson.News news = _noticiajson.news_list[comboBox1.SelectedIndex];

                tb_titulo_pagina.Text = news.page_title;
                tb_titulo_noticia.Text = news.news_title;
                tb_descricao_noticia.Text = news.news_description;
                tb_noticia.Text = news.news_text;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;

            } else
            {
                tb_titulo_pagina.Text = "";
                tb_titulo_noticia.Text = "";
                tb_descricao_noticia.Text = "";
                tb_noticia.Text = "";

                bt_new.Enabled = false;
                bt_remove.Enabled = false;
                bt_save.Enabled = true;

            }


        }

        private void bt_new_Click(object sender, EventArgs e)
        {

            comboBox1.SelectedIndex = -1;

            tb_titulo_pagina.Text = "";
            tb_titulo_noticia.Text = "";
            tb_descricao_noticia.Text = "";
            tb_noticia.Text = "";

            bt_new.Enabled = false;
            bt_remove.Enabled = false;
            bt_save.Enabled = true;

        }

        private void bt_save_Click(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0)
            {
                int selectedIndex = comboBox1.SelectedIndex;
                noticiajson.News news = _noticiajson.news_list[comboBox1.SelectedIndex];

                news.page_title = tb_titulo_pagina.Text;
                news.news_title = tb_titulo_noticia.Text;
                news.news_description = tb_descricao_noticia.Text;
                news.news_text = tb_noticia.Text;

                noticiajson.writeToFile("content/news.json", _noticiajson);

                comboBox1.Items.Clear();
                foreach (noticiajson.News nws in _noticiajson.news_list)
                    comboBox1.Items.Add(nws.news_title);

                comboBox1.SelectedIndex = selectedIndex;


                MessageBox.Show("Notícia atualizada!!!");
                return;
            }

            if (tb_titulo_noticia.Text.Length > 0)
            {

                noticiajson.News news = new noticiajson.News(); //_noticiajson.news_list[comboBox1.SelectedIndex];

                news.page_title = tb_titulo_pagina.Text;
                news.news_title = tb_titulo_noticia.Text;
                news.news_description = tb_descricao_noticia.Text;
                news.news_text = tb_noticia.Text;

                _noticiajson.news_list.Insert(0, news);

                noticiajson.writeToFile("content/news.json", _noticiajson);

                comboBox1.Items.Clear();
                foreach (noticiajson.News nws in _noticiajson.news_list)
                    comboBox1.Items.Add(nws.news_title);

                comboBox1.SelectedIndex = 0;

                bt_new.Enabled = true;
                bt_remove.Enabled = true;
                bt_save.Enabled = true;

                MessageBox.Show("Notícia adicionada: " + news.news_title);

            } else
            {
                MessageBox.Show("É necessário preencher os campos\npara criar uma notícia nova.");
            }
        }

        private void bt_remove_Click(object sender, EventArgs e)
        {
            if (comboBox1.SelectedIndex >= 0)
            {
                int selectedIndex = comboBox1.SelectedIndex;
                string noticiaTitle = _noticiajson.news_list[comboBox1.SelectedIndex].news_title;

                _noticiajson.news_list.RemoveAt(comboBox1.SelectedIndex);

                noticiajson.writeToFile("content/news.json", _noticiajson);

                comboBox1.Items.Clear();
                foreach (noticiajson.News nws in _noticiajson.news_list)
                    comboBox1.Items.Add(nws.news_title);

                if (selectedIndex < _noticiajson.news_list.Count)
                {
                    comboBox1.SelectedIndex = selectedIndex;

                    noticiajson.News news = _noticiajson.news_list[comboBox1.SelectedIndex];

                    tb_titulo_pagina.Text = news.page_title;
                    tb_titulo_noticia.Text = news.news_title;
                    tb_descricao_noticia.Text = news.news_description;
                    tb_noticia.Text = news.news_text;


                    bt_new.Enabled = true;
                    bt_remove.Enabled = true;
                    bt_save.Enabled = true;

                } else
                {

                    tb_titulo_pagina.Text = "";
                    tb_titulo_noticia.Text = "";
                    tb_descricao_noticia.Text = "";
                    tb_noticia.Text = "";

                    bt_new.Enabled = false;
                    bt_remove.Enabled = false;
                    bt_save.Enabled = true;
                }

                MessageBox.Show("Notícia removida: " + noticiaTitle);
            }
        }
    }
}

