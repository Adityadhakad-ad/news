import io
import webbrowser
import requests
from tkinter import *
from urllib.request import urlopen
from PIL import ImageTk, Image


class NewsApp:

    def __init__(self):

        # Fetch data
        self.data = requests.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=66b7e0f672cd48c3adbc52ffa6471f13').json()

        # Debugging
        print("Status:", self.data.get('status'))
        print("Total articles:", len(self.data.get('articles', [])))

        # Initial GUI load
        self.load_gui()

        # Load first news item only if articles exist
        if len(self.data.get('articles', [])) > 0:
            self.load_news_item(0)
        else:
            print("No news articles found.")

    def load_gui(self):

        self.root = Tk()
        self.root.geometry('350x600')
        self.root.resizable(0, 0)
        self.root.title('Mera News App')
        self.root.configure(background='black')

    def clear(self):

        for i in self.root.pack_slaves():
            i.destroy()

    def load_news_item(self, index):

        # Clear screen
        self.clear()

        # Image
        try:

            img_url = self.data['articles'][index]['urlToImage']

            raw_data = urlopen(img_url).read()

            im = Image.open(
                io.BytesIO(raw_data)
            ).resize((350, 250))

            photo = ImageTk.PhotoImage(im)

        except Exception as e:

            print("Image error:", e)

            img_url = 'https://www.hhireb.com/wp-content/uploads/2019/08/default-no-img.jpg'

            raw_data = urlopen(img_url).read()

            im = Image.open(
                io.BytesIO(raw_data)
            ).resize((350, 250))

            photo = ImageTk.PhotoImage(im)

        label = Label(
            self.root,
            image=photo
        )

        label.image = photo
        label.pack()

        # Heading
        heading = Label(
            self.root,
            text=self.data['articles'][index]['title'],
            bg='black',
            fg='white',
            wraplength=350,
            justify='center'
        )

        heading.pack(pady=(10, 20))
        heading.config(font=('verdana', 15))

        # Description
        details = Label(
            self.root,
            text=self.data['articles'][index]['description'],
            bg='black',
            fg='white',
            wraplength=350,
            justify='center'
        )

        details.pack(pady=(2, 20))
        details.config(font=('verdana', 12))

        # Button frame
        frame = Frame(
            self.root,
            bg='black'
        )

        frame.pack(
            expand=True,
            fill=BOTH
        )

        # Previous button
        if index != 0:

            prev = Button(
                frame,
                text='Prev',
                width=16,
                height=3,
                command=lambda: self.load_news_item(index - 1)
            )

            prev.pack(side=LEFT)

        # Read More
        read = Button(
            frame,
            text='Read More',
            width=16,
            height=3,
            command=lambda: self.open_link(
                self.data['articles'][index]['url']
            )
        )

        read.pack(side=LEFT)

        # Next button
        if index != len(self.data['articles']) - 1:

            next_button = Button(
                frame,
                text='Next',
                width=16,
                height=3,
                command=lambda: self.load_news_item(index + 1)
            )

            next_button.pack(side=LEFT)

    def open_link(self, url):

        webbrowser.open(url)


obj = NewsApp()

obj.root.mainloop()