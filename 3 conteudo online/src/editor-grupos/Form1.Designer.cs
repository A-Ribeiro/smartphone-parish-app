namespace editor_grupos
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.bt_new = new System.Windows.Forms.Button();
            this.bt_save = new System.Windows.Forms.Button();
            this.tb_titulo_pagina = new System.Windows.Forms.TextBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.bt_remove = new System.Windows.Forms.Button();
            this.tb_noticia = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.tb_parish = new System.Windows.Forms.TextBox();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // comboBox1
            // 
            this.comboBox1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.comboBox1.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBox1.FormattingEnabled = true;
            this.comboBox1.Location = new System.Drawing.Point(12, 28);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(246, 21);
            this.comboBox1.TabIndex = 0;
            this.comboBox1.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 12);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(44, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Grupos:";
            // 
            // bt_new
            // 
            this.bt_new.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.bt_new.Location = new System.Drawing.Point(264, 28);
            this.bt_new.Name = "bt_new";
            this.bt_new.Size = new System.Drawing.Size(75, 23);
            this.bt_new.TabIndex = 2;
            this.bt_new.Text = "novo";
            this.bt_new.UseVisualStyleBackColor = true;
            this.bt_new.Click += new System.EventHandler(this.bt_new_Click);
            // 
            // bt_save
            // 
            this.bt_save.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.bt_save.Location = new System.Drawing.Point(344, 7);
            this.bt_save.Name = "bt_save";
            this.bt_save.Size = new System.Drawing.Size(75, 23);
            this.bt_save.TabIndex = 3;
            this.bt_save.Text = "Salvar";
            this.bt_save.UseVisualStyleBackColor = true;
            this.bt_save.Click += new System.EventHandler(this.bt_save_Click);
            // 
            // tb_titulo_pagina
            // 
            this.tb_titulo_pagina.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tb_titulo_pagina.Location = new System.Drawing.Point(108, 27);
            this.tb_titulo_pagina.Name = "tb_titulo_pagina";
            this.tb_titulo_pagina.Size = new System.Drawing.Size(175, 20);
            this.tb_titulo_pagina.TabIndex = 4;
            // 
            // groupBox1
            // 
            this.groupBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.groupBox1.Controls.Add(this.tb_parish);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.bt_remove);
            this.groupBox1.Controls.Add(this.tb_noticia);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.tb_titulo_pagina);
            this.groupBox1.Location = new System.Drawing.Point(14, 57);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(405, 294);
            this.groupBox1.TabIndex = 5;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Notícia";
            // 
            // bt_remove
            // 
            this.bt_remove.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.bt_remove.Location = new System.Drawing.Point(289, 25);
            this.bt_remove.Name = "bt_remove";
            this.bt_remove.Size = new System.Drawing.Size(110, 23);
            this.bt_remove.TabIndex = 20;
            this.bt_remove.Text = "remover e salvar";
            this.bt_remove.UseVisualStyleBackColor = true;
            this.bt_remove.Click += new System.EventHandler(this.bt_remove_Click);
            // 
            // tb_noticia
            // 
            this.tb_noticia.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tb_noticia.Font = new System.Drawing.Font("Courier New", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tb_noticia.Location = new System.Drawing.Point(17, 111);
            this.tb_noticia.Multiline = true;
            this.tb_noticia.Name = "tb_noticia";
            this.tb_noticia.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tb_noticia.Size = new System.Drawing.Size(382, 177);
            this.tb_noticia.TabIndex = 15;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(14, 95);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(58, 13);
            this.label4.TabIndex = 8;
            this.label4.Text = "Descrição:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(14, 30);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(83, 13);
            this.label2.TabIndex = 5;
            this.label2.Text = "Nome do grupo:";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(14, 65);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(52, 13);
            this.label3.TabIndex = 21;
            this.label3.Text = "Paróquia:";
            // 
            // tb_parish
            // 
            this.tb_parish.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tb_parish.Location = new System.Drawing.Point(72, 62);
            this.tb_parish.MaxLength = 20;
            this.tb_parish.Name = "tb_parish";
            this.tb_parish.Size = new System.Drawing.Size(175, 20);
            this.tb_parish.TabIndex = 5;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(431, 363);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.bt_save);
            this.Controls.Add(this.bt_new);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.comboBox1);
            this.MinimumSize = new System.Drawing.Size(400, 400);
            this.Name = "Form1";
            this.Text = "Editor de Grupos";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox comboBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button bt_new;
        private System.Windows.Forms.Button bt_save;
        private System.Windows.Forms.TextBox tb_titulo_pagina;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox tb_noticia;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button bt_remove;
        private System.Windows.Forms.TextBox tb_parish;
        private System.Windows.Forms.Label label3;
    }
}

